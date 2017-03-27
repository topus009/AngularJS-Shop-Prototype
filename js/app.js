var app = angular.module('myApp', []).factory('pagination', function($sce) {
    var currentPage = 0;
    var itemsPerPage = 12;
    var products = [];
    return {
        setProducts: function(newProducts) {
            products = newProducts
        },
        /* END of setProducts */
        getPageProducts: function(num) {
            var num = angular.isUndefined(num) ? 0 : num;
            var first = itemsPerPage * num;
            var last = first + itemsPerPage;
            currentPage = num;
            last = last > products.length ? (products.length - 1) : last;
            return products.slice(first, last);
        },
        /* END of getPageProducts */
        getTotalPagesNum: function() {
            return Math.ceil(products.length / itemsPerPage);
        },
        /* END of getTotalPagesNum */
        getPaginationList: function() {
            var pagesNum = this.getTotalPagesNum();
            var paginationList = [];
            paginationList.push({
                name: $sce.trustAsHtml('&laquo;'),
                link: 'prev'
            });
            for(var i = 0; i < pagesNum; i++) {
                var name = i + 1;
                paginationList.push({
                    name: $sce.trustAsHtml(String(name)),
                    link: i
                });
            };
            paginationList.push({
                name: $sce.trustAsHtml('&raquo;'),
                link: 'next'
            });
            if(pagesNum > 2) {
                return paginationList;
            } else {
                return null;
            }
        },
        /* END of getPaginationList */
        getPrevPageProducts: function() {
            var prevPageNum = currentPage - 1;
            if(prevPageNum < 0) prevPageNum = 0;
            return this.getPageProducts(prevPageNum);
        },
        /* END of getPrevPageProducts */
        getNextPageProducts: function() {
            var nextPageNum = currentPage + 1;
            var pagesNum = this.getTotalPagesNum();
            if(nextPageNum >= pagesNum) nextPageNum = pagesNum - 1;
            return this.getPageProducts(nextPageNum);
        },
        /* END of getNextPageProducts */
        getCurrentPageNum: function() {
            return currentPage;
        },
        /* END of getCurrentPageNum */
    }
}) /* END of factory-pagination */ .controller('mainCtrl', function($scope, $http, pagination) {
    $http.get('http://127.0.0.1:8080/js/menu.json').success(function(data) {
        $scope.menuObj = data;
        // =====================
        var productsLength = data.products.length;
        var childCount = JSON.stringify(data).match(/"type":"детский"/g).length;
        var cornerCount = JSON.stringify(data).match(/"type":"угловой"/g).length;
        var framelessCount = JSON.stringify(data).match(/"type":"бескорпусный"/g).length;
        $scope.productsLength = productsLength;
        $scope.childCount = childCount;
        $scope.cornerCount = cornerCount;
        $scope.framelessCount = framelessCount;
        // =====================
        // ---------------------
        // ---------------------
        pagination.setProducts(data.products);
        $scope.products = pagination.getPageProducts($scope.currentPage);
        $scope.paginationList = pagination.getPaginationList();
    });
    $scope.showPage = function(page) {
        if(page == 'prev') {
            $scope.products = pagination.getPrevPageProducts();
        } else if(page == 'next') {
            $scope.products = pagination.getNextPageProducts();
        } else {
            $scope.products = pagination.getPageProducts(page);
        }
    }
    $scope.currentPageNum = function() {
        return pagination.getCurrentPageNum();
    }
});

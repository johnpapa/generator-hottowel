/* jshint -W079 */
var stubs = (function() {
    var service = {
        dataservice: {
            getPeople: getPeople,
            getMessageCount: getMessageCount
        }
    };
    return service;

    function getMessageCount($q, dataservice) {
        sinon.stub(dataservice, 'getMessageCount', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
    }

    function getPeople($q, dataservice) {
        sinon.stub(dataservice, 'getPeople', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockPeople());
            return deferred.promise;
        });
    }
})();

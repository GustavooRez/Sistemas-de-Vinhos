function WinesController($scope, $http) {

    $scope.wines = []
	$scope.searchWine = function() {
		$http.get('/', $scope).success(function(retorno) {
			$scope.wines.push(JSON.parse(retorno.vinhos))
            console.log(retorno)
		});
	}

	// $scope.adicionaContato = function() {
	// 	$http.post('/contato', $scope.contato).success(function() {
	// 		$scope.contatos.push($scope.contato);
	// 		$scope.contato = new Contato();
	// 	});
	// }
	
}
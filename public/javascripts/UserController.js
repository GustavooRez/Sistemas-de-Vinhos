function UserController($scope, $http) {

	function User() {
		this.nome = '';
		this.email = '';
		this.senha = '';
	}

	$scope.user = new User();

	$scope.searchUserLogin = function() {
		$http.post('/searchUserLogin', $scope.user).success(function(retorno) {
			await localStorage.setItem('token', retorno.token);
            await localStorage.setItem('userId', retorno._id);
            await localStorage.setItem('userName', retorno.nome);
		});
	}

	$scope.adicionaContato = function() {
		$http.post('/contato', $scope.contato).success(function() {
			$scope.contatos.push($scope.contato);
			$scope.contato = new Contato();
		});
	}
	
}
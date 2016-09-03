﻿(function () {
    'use strict';
    angular.module('app').service('appService', service);
    service.$inject = ['app_factory'];

    function service(dataProvider) {
        //CONCEPTO
        this.listarConcepto = function (concepto) {
            return dataProvider.postData("Concepto/ListarConcepto", concepto);
        },
        //USUARIO
        this.listarUsuario = function (usuario) {
            return dataProvider.postData("Usuario/ListarUsuario", usuario);
        },
        this.listarUsuarioGrupo = function (usuario) {
            return dataProvider.postData("Usuario/ListarUsuarioGrupo", usuario);
        },
        //Autocomplete Usuario Grupo
        this.buscarUsuarioGrupoAutoComplete = function (eUsuarioGrupo) {
            return dataProvider.postData("ComboUsuarioGrupo/ObtenerUsuarioGrupo", eUsuarioGrupo);
        },
        //UBIGEO
        this.listarDepartamento = function (ubigeo) {
            return dataProvider.getData("Ubigeo/ListarDepartamento");
        }
        this.listarProvincias = function (ubigeo) {
            return dataProvider.postData("Usuario/ListarProvincias", ubigeo);
        },
        this.listarDistritos = function (ubigeo) {
            return dataProvider.postData("Usuario/ListarDistritos", ubigeo);
        }
        //EMPRESA
    }
})();
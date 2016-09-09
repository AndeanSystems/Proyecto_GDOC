﻿(function () {
    'use strict';

    angular.module('app').controller('personal_controller', personal_controller);
    personal_controller.$inject = ['$location', 'app_factory', 'appService'];

    function personal_controller($location, dataProvider, appService) {
        /* jshint validthis:true */
        ///Variables

        var context = this;
        //LLENAR CONCEPTOS
        LlenarConcepto("010");
        LlenarConcepto("007");
        LlenarConcepto("013");
        LlenarConcepto("021");
        LlenarConcepto("009");
        LlenarConcepto("015");
        LlenarConcepto("024");

        context.personal = {};
        context.usuario = {};
        context.listDepartamento = [];

        context.usuario.ExpiraFirma = 0;

        //var NombreCompleto = "Personal.NombrePers".concat(" Personal.ApellidoPersonal");

        context.editarPersonal = function (rowIndex) {
            context.personal = context.gridOptions.data[rowIndex];
            context.codigodepartamento = parseInt(context.personal.CodigoUbigeo.substring(0, 2));
            context.obtenerProvincia(context.codigodepartamento);
            context.codigoprovincia = parseInt(context.personal.CodigoUbigeo.substring(2, 4));
            context.obtenerDistrito(context.codigodepartamento, context.codigoprovincia);
            context.codigodistrito = parseInt(context.personal.CodigoUbigeo.substring(4, 6));
            $("#modal_contenido").modal("show");
        };

        context.buscarUsuarioPersonal = function (user, documento, idetificacion) {

            dataProvider.postData("Usuario/BuscarUsuarioPersonal", { NombreUsuario: user }, { NumeroIdentificacion: documento }, { TipoIdentificacion: idetificacion }).success(function (respuesta) {
                console.log(respuesta);
                context.usuario = respuesta[0];
                console.log(context.usuario)
            }).error(function (error) {
                //MostrarError();
            });
        };

        context.eliminarUsuario = function (rowIndex) {
            var usuario = context.gridOptions.data[rowIndex];
            dataProvider.postData("Usuario/EliminarUsuario", usuario).success(function (respuesta) {
                console.log(usuario);
                listarUsuario();
            }).error(function (error) {
                //MostrarError();
            });
        };


        context.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            //enableFiltering: true,
            data: [],
            appScopeProvider: context,
            columnDefs: [
                { field: 'IDEmpresa', displayName: 'ID Empresa' },
                { field: 'NombrePers', displayName: 'Nombres' },
                { field: 'NumeroIdentificacion', displayName: 'Numero de Identificacion' },
                //{ field: 'Personal.TelefonoPersonal', displayName: 'Telefono Personal' },
                //{ field: 'ClaseUsu.DescripcionConcepto', displayName: 'Clase Usuario' },
                {
                    name: 'Acciones', cellTemplate: '<i ng-click="grid.appScope.editarPersonal(grid.renderContainers.body.visibleRowCache.indexOf(row))" class="fa fa-pencil-square-o" style="padding: 4px;font-size: 1.4em;" data-placement="top" data-toggle="tooltip" title="Editar"></i>' +
                                                  '<i ng-click="grid.appScope.eliminarUsuario(grid.renderContainers.body.visibleRowCache.indexOf(row))" class="fa fa-times" style="padding: 4px;font-size: 1.4em;" data-placement="top" data-toggle="tooltip" title="Desactivar"></i> ' 
                }

            ],
        };

        //Eventos
        context.grabar = function (numeroboton) {
            console.log(context.personal);

            var personal = context.personal;
            var departamento, provincia, distrito;

            if (numeroboton == 1)
                personal.EstadoPersonal = 0
            else if (numeroboton == 2)
                personal.EstadoPersonal = 1

            departamento = (context.codigodepartamento < 10) ? "0" + context.codigodepartamento : context.codigodepartamento.toString();
            provincia = (context.codigoprovincia < 10) ? "0" + context.codigoprovincia : context.codigoprovincia.toString();
            distrito = (context.codigodistrito < 10) ? "0" + context.codigodistrito : context.codigodistrito.toString();

            personal.CodigoUbigeo = (departamento + provincia + distrito);

            dataProvider.postData("Personal/GrabarPersonal", personal).success(function (respuesta) {
                console.log(respuesta);
                listarPersonal();
                $("#modal_contenido").modal("hide");
            }).error(function (error) {
                //MostrarError();
            });
        }


        context.buscarUsuario = function (usuario) {
            //usuario.Personal.NombrePers = usuario
            dataProvider.postData("Usuario/BuscarUsuarioNombre", usuario).success(function (respuesta) {
                //context.usuario = respuesta[0];
                context.gridOptions.data = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        //Metodos
        context.obtenerProvincia = function (CodigoDepartamento) {
            console.log(CodigoDepartamento);
            dataProvider.postData("Ubigeo/ListarProvincias", { CodigoDepartamento: CodigoDepartamento }).success(function (respuesta) {
                console.log(respuesta);
                context.listPronvincia = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        context.obtenerDistrito = function (CodigoDepartamento, CodigoProvincia) {
            dataProvider.postData("Ubigeo/ListarDistritos", { CodigoDepartamento: CodigoDepartamento, CodigoProvincia: CodigoProvincia }).success(function (respuesta) {
                console.log(respuesta);
                context.listDistrito = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }
        function listarPersonal() {
            dataProvider.getData("Personal/ListarPersonal").success(function (respuesta) {
                context.gridOptions.data = respuesta;
                //context.listEmpresa = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        function listarDepartamento() {
            dataProvider.getData("Ubigeo/ListarDepartamento").success(function (respuesta) {
                context.listDepartamento = respuesta;
            }).error(function (error) {

            });
        }

        function LlenarConcepto(tipoConcepto) {
            var concepto = { TipoConcepto: tipoConcepto };
            appService.listarConcepto(concepto).success(function (respuesta) {
                if (concepto.TipoConcepto == "010")
                    context.listTipoUsuario = respuesta;
                else if (concepto.TipoConcepto == "007")
                    context.listTipoCargo = respuesta;
                else if (concepto.TipoConcepto == "013")
                    context.listArea = respuesta;
                else if (concepto.TipoConcepto == "021")
                    context.listClaseUsuario = respuesta;
                else if (concepto.TipoConcepto == "009")
                    context.listTipoRol = respuesta;
                else if (concepto.TipoConcepto == "015")
                    context.listTipoPersonal = respuesta;
                else if (concepto.TipoConcepto == "024")
                    context.listTipoIdentificacion = respuesta;
            });
        }

        function listarEmpresa() {
            dataProvider.getData("Empresa/ListarEmpresa").success(function (respuesta) {
                context.listEmpresa = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }
        ////Carga
        listarDepartamento();
        listarPersonal();
        listarEmpresa();
    }
})();

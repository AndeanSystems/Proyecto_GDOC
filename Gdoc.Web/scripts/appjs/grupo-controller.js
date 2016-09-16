﻿(function () {
    'use strict';

    angular.module('app').controller('grupo_controller', grupo_controller);
    grupo_controller.$inject = ['$location', 'app_factory', 'appService'];

    function grupo_controller($location, dataProvider, appService) {
        /* jshint validthis:true */
        ///Variables
        var context = this;
        context.listGrupo = [];
        context.listUsuario = [];
        context.grupo = {};
        context.listaUsuariosGrupo = [];
        context.listaUsuarioGrupo = [];
        context.participantesGrupo = [];
        context.visible = "List";

        //Crear Combo Auto Filters
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        context.usuarioDestinatarios = [];
        context.filterSelected = true;
        context.querySearch = querySearch;
        var usuario = {};


        context.editarGrupo = function (rowIndex) {
            context.grupo = context.gridOptions.data[rowIndex];
        };

        context.eliminarGrupo = function (rowIndex) {
            var grupo = context.gridOptions.data[rowIndex];
            dataProvider.postData("Grupo/EliminarGrupo", grupo).success(function (respuesta) {
                console.log(grupo);
                listarGrupo();
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
                { field: 'NombreGrupo', displayName: 'Grupo' },
                { field: 'CantidadUsuarios', displayName: 'Participantes' },
                { field: 'ComentarioGrupo', displayName: 'Comentario' },
                { field: 'Estado.DescripcionConcepto', displayName: 'Estado' },

                {
                    name: 'Acciones',
                    cellTemplate: '<i ng-click="grid.appScope.editarGrupo(grid.renderContainers.body.visibleRowCache.indexOf(row))" class="fa fa-pencil-square-o  " style="padding: 4px;font-size: 1.4em;" data-placement="top" data-toggle="tooltip" title="Editar"></i>' +
                                  '<i ng-click="grid.appScope.eliminarGrupo(grid.renderContainers.body.visibleRowCache.indexOf(row))" class="fa fa-times  " style="padding: 4px;font-size: 1.4em;" data-placement="top" data-toggle="tooltip" title="Borrar"></i>'
                }

            ],
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            //onRegisterApi : function( gridApi ) {
            //    context.gridApi = gridApi;
            //    gridApi.selection.on.rowSelectionChanged(context, function (row) {
            //        var msg = 'row selected ' + row.isSelected;
            //        console.log(msg);
            //    });
            //}
        };

        context.CambiarVentana = function (mostrarVentana) {
            context.visible = mostrarVentana;
            if (context.visible != "List") {
            }
        }
        //context.listausuariosgrupo = [];
        //context.Usuario = {};

        //Eventos

        context.buscarGrupo = function (NombreGrupo) {
            if (NombreGrupo == "") {
                listarGrupo();
            }
            else {
                dataProvider.postData("Grupo/BuscarGrupo", { NombreGrupo: NombreGrupo }).success(function (respuesta) {
                    console.log(respuesta);
                    context.gridOptions.data = respuesta;
                }).error(function (error) {
                    //MostrarError();
                });
            }

            
        }

        context.agregar = function (IDUsuario) {
            if (context.grupo.CodigoGrupo == undefined)
                alert("vacio");
            else {
                context.listaUsuariosGrupo.push(context.grupo);
                context.grupo = {};
            }
            //dataProvider.postData("Usuario/ListarUsuarioGrupo", { IDUsuario: IDUsuario }).success(function (respuesta) {
            //    console.log(respuesta);
            //    context.listaUsuariosGrupo.push(respuesta);
            //}).error(function (error) {
            //    //MostrarError();
            //});
        }
        context.grabar = function (numeroboton) {

            var grupo = context.grupo;

            let listEUsuarioGrupo = [];
            for (var ind in context.participantesGrupo) {
                listEUsuarioGrupo.push(context.participantesGrupo[ind]);
            }

            if (numeroboton == 1)
                grupo.EstadoGrupo = 0
            else if (numeroboton == 2)
                grupo.EstadoGrupo = 1

            console.log(context.grupo);
            dataProvider.postData("Grupo/GrabarGrupoUsuarios", { grupo: grupo, listUsuarioGrupo: listEUsuarioGrupo }).success(function (respuesta) {
                console.log(respuesta);
                listarGrupo();
                context.grupo = {};
                $("#modal_contenido").modal("hide");
            }).error(function (error) {
                //MostrarError();
            });
        }

        //Metodos
        function listarUsuarioGrupoAutoComplete(Nombre) {
            var UsuarioGrupo = { Nombre: Nombre };
            appService.buscarUsuarioGrupoAutoComplete(UsuarioGrupo).success(function (respuesta) {
                //context.listaUsuario = respuesta;
                context.listaUsuarioGrupo = respuesta;
            });
        }

        function querySearch(criteria) {
            listarUsuarioGrupoAutoComplete(criteria);
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? context.listaUsuarioGrupo : [];
        }

        function listarGrupo() {
            dataProvider.getData("Grupo/ListarGrupo").success(function (respuesta) {
                context.gridOptions.data = respuesta;
                context.listGrupo = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        function listarUsuario() {
            dataProvider.getData("Usuario/ListarUsuario").success(function (respuesta) {
                context.listUsuario = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        
        //Carga
        listarGrupo();
        listarUsuario();
    }
})();

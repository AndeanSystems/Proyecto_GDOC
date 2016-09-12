﻿//Leer Archivos de de fisico a binario
var archivosSelecionados = [];
function ReadFileToBinary(control) {
    for (var i = 0, f; f = control.files[i]; i++) {
        let Name = f.name;Size = f.size;Type = f.type;
        var reader = new FileReader();
        reader.onloadend = function (e) {
            archivosSelecionados.push({
                NombreArchivo: Name,
                TamanoArchivo: Size,
                TipoArchivo: Type,
                RutaBinaria: e.target.result
                });
        }
        reader.readAsBinaryString(f);
    }
}
//Angular JS
(function () {
    'use strict';

    angular.module('app').controller('documentodigital_controller', documentodigital_controller);
    documentodigital_controller.$inject = ['$location', 'app_factory', 'appService'];

    function documentodigital_controller($location, dataProvider, appService) {
        /* jshint validthis:true */
        ///Variables
        let TipoDocumento = "012";
        let PrioridadAtencion = "005";
        let TipoAcceso = "002";
        let TipoComunicacion = "022";
        var context = this;
        context.operacion = {};
        context.DocumentoDigitaloOperacion = {};
        context.IndexacionDocumento = [];
        context.referencia = {};
        context.visible = "List";
        context.listaReferencia = [];
        context.listaUsuarioGrupo = [];

        //Crear Combo Auto Filters
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        context.usuarioDestinatarios = [];
        context.filterSelected = true;
        context.querySearch = querySearch;
        var usuario = {};


        LlenarConcepto(TipoDocumento);
        LlenarConcepto(TipoAcceso);
        LlenarConcepto(PrioridadAtencion);
        //LlenarConcepto(TipoComunicacion);

        //COMIENZO
        context.operacion = {
            AccesoOperacion : '1'
        };
        context.DocumentoDigitaloOperacion = {
            DerivarDocto: 'S',
            DoctoExterno: 'S'
        }
        context.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            //enableFiltering: true,//FILTRO
            data: [],
            appScopeProvider: context,
            columnDefs: [
                { field: 'NumeroOperacion', displayName: 'Nº Documento' },
                { field: 'TipoDoc.DescripcionConcepto', displayName: 'Tipo de Documento' },
                { field: 'DescripcionOperacion', displayName: '	Asunto' },
                { field: 'FechaRegistro', displayName: 'Fecha Emisión', type: 'date', cellFilter: 'toDateTime | date:"dd/MM/yyyy"' },
                { field: 'FechaVigente', displayName: '	Fecha Recepción', type: 'date', cellFilter: 'toDateTime | date:"dd/MM/yyyy"' },
                { field: 'Estado.DescripcionConcepto', displayName: 'Estado' },
                {
                    name: 'Acciones',
                    cellTemplate: '<i style="padding: 4px;font-size: 1.4em;" class="fa fa-eye" data-placement="top" data-toggle="tooltip" title="Ver"></i>' +
                                '<i ng-click="grid.appScope.editarOperacion(grid.renderContainers.body.visibleRowCache.indexOf(row))" style="padding: 4px;font-size: 1.4em;" class="fa fa-pencil-square-o" data-placement="top" data-toggle="tooltip" title="Editar"></i>' +
                                '<i ng-click="grid.appScope.eliminarOperacion(grid.renderContainers.body.visibleRowCache.indexOf(row))" style="padding: 4px;font-size: 1.4em;" class="fa fa-times" data-placement="top" data-toggle="tooltip" title="" data-original-title="Borrar"></i>'
                }
            ]
        };
        //Eventos
        context.agregarreferencia = function (referencia) {
            if (context.referencia.DescripcionIndice == undefined)
                alert("Ingrese Referencia");
            else {
                context.listaReferencia.push(context.referencia);
                console.log(context.listaReferencia);
                context.referencia = {};
            }
        }

        context.eliminarreferencia = function (referencia) {
            console.log(referencia);
            context.listaReferencia.splice(referencia, 1);//POR TERMINAR
            //context.referencia = {};
        }
        context.ObtenerImagen = function (element) {
            console.log(element);
        }
        context.grabar = function (numeroboton) {

            console.log(context.operacion);
            let Operacion = context.operacion;
            let DocumentoDigitalOperacion = context.DocumentoDigitaloOperacion;
            let listIndexacionDocumento = context.listaReferencia;

            let listEUsuarioGrupo = [];
            for (var ind in context.usuarioDestinatarios) {
                listEUsuarioGrupo.push(context.usuarioDestinatarios[ind]);
            }

            if (numeroboton == 1)
                Operacion.EstadoOperacion = 0
            else if (numeroboton == 2)
                Operacion.EstadoOperacion = 1
            console.log(listIndexacionDocumento);
            console.log(listEUsuarioGrupo);
            let listDocumentoDigitaloOperacion = [];
            for (var index in archivosSelecionados) {
                listDocumentoDigitaloOperacion.push({
                    RutaFisica: archivosSelecionados[index].RutaBinaria,
                    NombreOriginal: archivosSelecionados[index].NombreArchivo,
                    TamanoDcto: archivosSelecionados[index].TamanoArchivo,
                });
            }
            dataProvider.postData("DocumentoDigital/Grabar", { Operacion: Operacion, listDocumentoDigitalOperacion: listDocumentoDigitaloOperacion, listEUsuarioGrupo: listEUsuarioGrupo, listIndexacion: listIndexacionDocumento }).success(function (respuesta) {
                console.log(respuesta);
            }).error(function (error) {
                //MostrarError();
            });
            limpiarFormulario();           
        }

        context.editarOperacion = function (rowIndex) {
            context.operacion = context.gridOptions.data[rowIndex];
            context.DocumentoDigitaloOperacion = context.operacion.DocumentoDigitalOperacion;
            //context.codigodepartamento = parseInt(context.empresa.CodigoUbigeo.substring(0, 2));
            context.operacion.AccesoOperacion = context.operacion.AccesoOperacion.substring(0,1)
            console.log(context.operacion);
            console.log(context.DocumentoDigitaloOperacion);
            context.CambiarVentana('CreateAndEdit');
        };

        context.eliminarOperacion = function (rowIndex) {
            var empresa = context.gridOptions.data[rowIndex];
            dataProvider.postData("DocumentoDigital/EliminarOperacion", empresa).success(function (respuesta) {
                console.log(respuesta);
                listarOperacion();
            }).error(function (error) {
                //MostrarError();
            });
        };

        context.CambiarVentana = function (mostrarVentana) {
            limpiarFormulario();
            context.visible = mostrarVentana;
            if (context.visible != "List") {
                context.operacion = {
                    AccesoOperacion: '1',
                    TipoComunicacion: '1'
                };
                context.DocumentoDigitaloOperacion = {
                    DerivarDocto: 'S'
                };
            }
        }
        ////
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

        function LlenarConcepto(tipoConcepto) {
            var concepto = { TipoConcepto: tipoConcepto };
            appService.listarConcepto(concepto).success(function (respuesta) {
                if (concepto.TipoConcepto == TipoDocumento)
                    context.listTipoDocumento = respuesta;
                else if (concepto.TipoConcepto == PrioridadAtencion)
                    context.listPrioridadAtencion = respuesta;
                else if (concepto.TipoConcepto == TipoAcceso)
                    context.listTipoAcceso = respuesta;
                else if (concepto.TipoConcepto == TipoComunicacion)
                    context.listTipoComunicacion = respuesta;
            });
        }

        function listarOperacion() {
            dataProvider.getData("DocumentoDigital/ListarOperacion").success(function (respuesta) {
                context.gridOptions.data = respuesta;
                context.listEmpresa = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }

        function limpiarFormulario() {
            context.operacion = {};
            context.usuarioDestinatarios = [];
            context.DocumentoDigitaloOperacion = {};
            context.referencia = {};
            context.listaReferencia = [];
        }
        listarOperacion();
    }
})();
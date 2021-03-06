﻿(function () {
    'use strict';

    angular.module('app').controller('busqueda_controller', busqueda_controller);
    busqueda_controller.$inject = ['$location', 'app_factory', 'appService'];

    function busqueda_controller($location, dataProvider, appService) {
        /* jshint validthis:true */
        ///Variables
        var context = this;
        let TipoOperacion = "003";
        let TipoDocumento = "012";
        let PrioridadAtencion = "005";
        let TipoAcceso = "002";
        let TipoComunicacion = "022";
        context.operacion = {};


        context.operacion = {
            TipoOperacion: '',
            TipoDocumento: '',

        };
        context.indexacion = {};

        context.indexacion = {
            DescripcionIndice:' ',
        };
        context.referencia = false;
        context.operacion.FechaRegistro = new Date();
        context.operacion.FechaEmision = new Date();

        LlenarConcepto(TipoOperacion);
        //LlenarConcepto(TipoDocumento);

        context.buscarOperacion = function (operacion, indexacion) {
            console.log(context.FechaDesde);
            console.log(operacion);
            dataProvider.postData("Busqueda/ListarOperacionBusqueda", { operacion: operacion, indexacion: indexacion }).success(function (respuesta) {
                console.log(respuesta);
                context.gridOptions.data = respuesta;
                limpiarFormulario();
            }).error(function (error) {
                //MostrarError();
            });
        }
        context.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enableSorting: true,
            data: [],
            appScopeProvider: context,
            columnDefs: [
                {
                    name: 'Acciones',
                    cellTemplate: '<i class="fa fa-file-pdf-o" ng-click="grid.appScope.mostrarPDF(grid.renderContainers.body.visibleRowCache.indexOf(row))" style="padding: 4px;font-size: 1.4em;" data-placement="bottom" data-toggle="tooltip" title="Ver Documento pdf"></i>' +
                            '<i class="fa fa-paperclip" ng-click="grid.appScope.mostrarAdjuntos(grid.renderContainers.body.visibleRowCache.indexOf(row))" style="padding: 4px;font-size: 1.4em;"  data-placement="bottom" data-toggle="tooltip" title="Ver Adjuntos"></i>'
                },
                { field: 'TipoOpe.DescripcionCorta', displayName: 'Tipo Operación' },
                { field: 'NumeroOperacion', displayName: 'Numero Operación' },
                { field: 'FechaEnvio', displayName: 'Fecha Envío', type: 'date', cellFilter: 'toDateTime | date:"dd/MM/yyyy HH:mm"' },
                { field: 'TipoDoc.DescripcionCorta', displayName: 'Tipo Doc./Grupo' },
                { field: 'Acceso.DescripcionCorta', displayName: 'Acceso Operación' },
                { field: 'TituloOperacion', displayName: 'Titulo Operación' }
            ]
        };
        context.obtenerTipoDocumento = function (tipooperacion) {
            var texto = "";
            if (tipooperacion == "02") {
                texto = "DD";
                context.operacion.TipoDocumento = "41";
            }
            else if (tipooperacion == "03"){
                texto = "DE";
                context.operacion.TipoDocumento = "01";
            }
            else if (tipooperacion == "04") {
                texto = "MV";
                context.operacion.TipoDocumento = "81";
            }
            var concepto = { TipoConcepto: TipoDocumento, TextoUno: texto }
            console.log(concepto);
            dataProvider.postData("Concepto/ListarConceptoTipoDocumento", concepto).success(function (respuesta) {
                console.log(respuesta);
                context.listTipoDocumento = respuesta;
            }).error(function (error) {
                //MostrarError();
            });
        }
        context.mostrarPDF = function (rowIndex) {
            context.operacion = context.gridOptions.data[rowIndex];
            if (context.operacion.TipoOperacion == "04") {
                appService.mostrarAlerta("Información", "Esta Operacion no Contiente Documento", "warning");
                limpiarFormulario();
            }
            else {
                dataProvider.postData("Busqueda/ListarDocumentoPDF", context.operacion).success(function (respuesta) {
                    console.log(respuesta)
                    if (respuesta != "vacio")
                        window.open(respuesta, "mywin", "resizable=1");
                    else
                        appService.mostrarAlerta("Información", "Esta Operacion es privada no tiene acceso", "warning");
                }).error(function (error) {
                    //MostrarError();
                });
                limpiarFormulario();    
            }
        }
        context.mostrarAdjuntos = function (rowIndex) {
            context.operacion = context.gridOptions.data[rowIndex];
            console.log(context.operacion);
            if (context.operacion.TipoOperacion == "04") {
                appService.mostrarAlerta("Información", "Esta Operacion no Contiente Documento", "warning");
                limpiarFormulario();
            }
            else {
                if (context.operacion.TipoOperacion != "02") {
                    dataProvider.postData("Busqueda/ListarAdjunto", context.operacion).success(function (respuesta) {
                        console.log(respuesta)
                        context.listDocumentoAdjunto = respuesta;
                        if (respuesta!="vacio")
                            $("#modal_adjuntos").modal("show");
                        else
                            appService.mostrarAlerta("Información", "Esta Operacion es privada no tiene acceso", "warning");
                    }).error(function (error) {
                        //MostrarError();
                    });
                }
                else {
                    appService.mostrarAlerta("Información", "Esta Operación no tiene Adjuntos", "warning")
                }
            }
        }
        context.mostrarAdjuntoWindows = function (archivo) {
            console.log(archivo);
            dataProvider.postData("DocumentosRecibidos/ListarAdjuntos", archivo).success(function (respuesta) {
                console.log(respuesta)
                window.open(respuesta, "mywin", "resizable=1");
                //window.open(respuesta, '_blank');
            }).error(function (error) {
                //MostrarError();
            });
        }
        //Eventos
        //Metodos
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
                else if (concepto.TipoConcepto == TipoOperacion)
                    context.listTipoOperacion = respuesta;
            });
        }
        function listarDocumentoAdjunto(operacion) {
            dataProvider.postData("DocumentosRecibidos/ListarAdjunto", operacion).success(function (respuesta) {
                context.listDocumentoAdjunto = respuesta;
                console.log(context.listDocumentoAdjunto);
            }).error(function (error) {
                //MostrarError();
            });
        }
        function FechasInicio() {
            var fechainicio = context.operacion.FechaEmision;
            context.operacion.FechaEmision.setDate(context.operacion.FechaEmision.getDate() - 30);
        }
        function limpiarFormulario() {
            context.operacion = {};
            context.indexacion = {};
            context.operacion.FechaRegistro = new Date();
            context.operacion.FechaEmision = new Date();
            FechasInicio();
        }
        //Carga
        FechasInicio();
    }
})();

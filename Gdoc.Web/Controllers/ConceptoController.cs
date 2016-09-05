﻿using Gdoc.Entity.Models;
using Gdoc.Negocio;
using Gdoc.Web.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Gdoc.Web.Controllers
{
    public class ConceptoController : Controller
    {
        #region "Variables"
        MensajeConfirmacion mensajeRespuesta = new MensajeConfirmacion();
        #endregion
        // GET: Concepto
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarConcepto() {
            var listConcepto = new List<Concepto>();
            using (var oConcepto = new NConcepto())
            {
                //falta terminar
                listConcepto = oConcepto.ListarConcepto().OrderBy(x => x.CodiConcepto).ToList();
    
            }
            return new JsonResult { Data = listConcepto, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };
        }
        [HttpPost]
        public JsonResult ListarConcepto(Concepto concepto)
        {
            var listConcepto = new List<Concepto>();
            using (var oConcepto = new NConcepto())
            {
                listConcepto = oConcepto.ListarConcepto().Where(x => x.TipoConcepto == concepto.TipoConcepto).OrderBy(x => x.DescripcionConcepto).ToList();
                //listConceptoRetorno.ForEach(x => listConcepto.Add(x));
            }
            return new JsonResult { Data = listConcepto, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };
        }
        [HttpPost]
        public JsonResult BuscarConceptoEstado(Concepto concepto)
        {
            var listConcepto = new List<Concepto>();
            using (var oConcepto = new NConcepto())
            {
                if (concepto.EstadoConcepto == null)
                {
                    listConcepto = oConcepto.ListarConcepto().Where(x => x.TipoConcepto == concepto.CodiConcepto).ToList();
                }
                else
                {
                    listConcepto = oConcepto.ListarConcepto().Where(x => x.TipoConcepto == concepto.CodiConcepto && x.EstadoConcepto == concepto.EstadoConcepto).ToList();
                }
                //listConceptoRetorno.ForEach(x => listConcepto.Add(x));
            }
            return new JsonResult { Data = listConcepto, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };
        }
        [HttpPost]
        public JsonResult GrabarConcepto(Concepto concepto) {
            using (var oConcepto = new NConcepto())
            {
                concepto.UsuarioModifica = Session["NombreUsuario"].ToString();
                concepto.FechaModifica = System.DateTime.Now;
                //var respuesta = oConcepto.GrabarConcepto(concepto);
                Concepto respuesta = null;
                if (concepto.IDEmpresa > 0){
                    respuesta = oConcepto.EditarConcepto(concepto);
                }
                else if (concepto.IDEmpresa < 1)
                {
                    concepto.IDEmpresa = Convert.ToInt32(Session["IDEmpresa"]);
                    concepto.EditarRegistro = 1;//por terminar
                    concepto.UsuarioModifica = Session["NombreUsuario"].ToString();
                    concepto.FechaModifica = System.DateTime.Now;
                    respuesta = oConcepto.GrabarConcepto(concepto);
                }
                    
                mensajeRespuesta.Exitoso = true;
                mensajeRespuesta.Mensaje = "Grabación Exitoso";
            }
            return new JsonResult { Data = mensajeRespuesta };
        }
        public JsonResult EliminarConcepto(Concepto concepto)
        {
            using (var oConcepto = new NConcepto())
            {
                concepto.EstadoConcepto = Gdoc.Web.Util.Estados.EstadoEmpresa.Inactivo;
                var respuesta = oConcepto.EliminarConcepto(concepto);
                mensajeRespuesta.Exitoso = true;
                mensajeRespuesta.Mensaje = "Grabación Exitoso";
            }
            return new JsonResult { Data = mensajeRespuesta };
        }
    }
}
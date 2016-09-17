﻿using Gdoc.Entity.Extension;
using Gdoc.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gdoc.Dao
{
    public class DModuloPaginaUrl
    {
        public List<EModuloPaginaUrl> ObtenerPaginaModuloUrl(Usuario eUsuario)
        {
            var listModuloPaginaUrl = new List<EModuloPaginaUrl>();
            try
            {
                using (var db = new DataBaseContext())
                {
                    var query = (from modulo in db.ModuloPaginaUrls.Include("AccesoSistema")
                                   select new { modulo }).ToList();

                    foreach (var eModuloPaginaUrl in query)
                    {
                        //var listAccesoSistema = new List<AccesoSistema>();
                        //foreach (var itemAcceso in eModuloPaginaUrl.modulo.AccesoSistemas.Where(x => x.IDUsuario == eUsuario.IDUsuario).ToList()) {
                        //    listAccesoSistema.Add(new AccesoSistema {
                        //        EstadoAcceso = itemAcceso.EstadoAcceso,
                        //        FechaModificacion = itemAcceso.FechaModificacion,
                        //        IDAcceso = itemAcceso.IDAcceso,
                        //        IdeUsuarioRegistro = itemAcceso.IdeUsuarioRegistro,
                        //        IDModuloPagina = itemAcceso.IDModuloPagina,
                        //        IDUsuario = itemAcceso.IDUsuario,
                        //        Usuario = eUsuario
                        //    });
                        //}
                        listModuloPaginaUrl.Add(new EModuloPaginaUrl
                        {
                            Asignacion = eModuloPaginaUrl.modulo.AccesoSistemas.Count(x => x.IDUsuario == eUsuario.IDUsuario) > 0?"Asignado":"No Asignado",
                            CodigoPaginaPadre = eModuloPaginaUrl.modulo.CodigoPaginaPadre,
                            ComentarioPagina = eModuloPaginaUrl.modulo.ComentarioPagina,
                            DireccionFisicaPagina = eModuloPaginaUrl.modulo.DireccionFisicaPagina,
                            EstadoPagina = eModuloPaginaUrl.modulo.EstadoPagina,
                            IDModuloPagina = eModuloPaginaUrl.modulo.IDModuloPagina,
                            ModuloSistema = eModuloPaginaUrl.modulo.ModuloSistema,
                            NombrePagina = eModuloPaginaUrl.modulo.NombrePagina
                        });
                    }
                }
                return listModuloPaginaUrl;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

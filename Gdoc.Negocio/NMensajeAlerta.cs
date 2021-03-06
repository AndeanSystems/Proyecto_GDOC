﻿using Gdoc.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Gdoc.Entity.Models;
using Gdoc.Entity.Extension;

namespace Gdoc.Negocio
{
    public class NMensajeAlerta : IDisposable
    {
        private DMensajeAlerta dMensajeAlerta = new DMensajeAlerta();
        public void Dispose()
        {
            dMensajeAlerta = null;
        }
        public List<EMensajeAlerta> ListarMensajeAlerta(Int64 IDUsuario)
        {
            try
            {
                //return dMensajeAlerta.ListarMensajeAlerta().Where(x => x.IDUsuario == IDUsuario).ToList();
                return dMensajeAlerta.ListarMensajeAlerta(IDUsuario);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public Int32 GrabarMensajeAlerta(MensajeAlerta mensajeAlerta)
        {
            try
            {
                dMensajeAlerta.GrabarMensajeAlerta(mensajeAlerta);
                return 1;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

﻿using Gdoc.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Gdoc.Entity.Models;

namespace Gdoc.Negocio
{
    public class NUsuario : IDisposable
    {
        private DUsuario dUsuario = new DUsuario();
        public void Dispose()
        {
            dUsuario = null;
        }

        public Usuario ValidarLogin(Usuario usuario)
        {
            try
            {
                return dUsuario.ValidarLogin(usuario);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}

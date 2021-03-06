﻿using Gdoc.Entity.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gdoc.Entity.Extension
{
    [NotMapped]
    public class EUsuario:Usuario
    {
        public Concepto Cargo { get; set; }
        public Concepto TipoUsuario { get; set; }
        public Concepto Area { get; set; }
        public Concepto ClaseUsu { get; set; }
        public Concepto Estado { get; set; }
        public Empresa RazoSocial { get; set; }
        public EPersonal EPersonal { get; set; }
        public string NombreCompleto { get; set; }
        public int CantidadAlerta { get; set; }
        public int CantidadDocumentosRecibidos { get; set; }
        public int CantidadMesasVirtual { get; set; }
    }
}

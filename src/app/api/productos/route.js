import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM productos');

    const productos = rows.map((row) => ({
      ...row,
      imagen: row.imagen ? row.imagen.toString('base64') : null, // Convertir imagen a base64
    }));

    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('imagen');
    const nombre = formData.get('nombre');
    const precio = formData.get('precio');
    const descripcion = formData.get('descripcion');

    if (!nombre || !precio || !descripcion || !file) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    // Leer el contenido del archivo como base64
    const buffer = Buffer.from(await file.arrayBuffer());

    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?)',
      [nombre, parseFloat(precio), descripcion, buffer]
    );

    return NextResponse.json({
      id: result.insertId,
      nombre,
      precio,
      descripcion,
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    return NextResponse.json({ error: 'Error al agregar producto.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const id = new URL(req.url).searchParams.get('id');
  const formData = await req.formData();
  const file = formData.get('imagen');
  const nombre = formData.get('nombre');
  const precio = formData.get('precio');
  const descripcion = formData.get('descripcion');

  if (!id || !nombre || !precio || !descripcion) {
    return NextResponse.json(
      { error: 'Todos los campos son obligatorios.' },
      { status: 400 }
    );
  }

  try {
    let buffer = null;

    if (file) {
      // Si se proporciona una nueva imagen, conviértela en un buffer
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      // Si no se proporciona una nueva imagen, recupera la imagen existente de la base de datos
      const [rows] = await db.query('SELECT imagen FROM productos WHERE id = ?', [id]);
      if (rows.length > 0) {
        buffer = rows[0].imagen; // Mantén la imagen existente
      }
    }

    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ? WHERE id = ?',
      [nombre, parseFloat(precio), descripcion, buffer, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ error: 'Error al actualizar producto.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID es requerido.' }, { status: 400 });
  }

  try {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto.' }, { status: 500 });
  }
}

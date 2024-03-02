const db = require("../db");
const MooviesController = {
  async findAll(req, res) {
    try {
      const moovies = await db.query(`
      SELECT 
        f.*,
        c.nome AS category_nome,
        c.description AS category_description
      FROM moovies f 
      INNER JOIN category c ON c.id = f.category_id
    `);

      res.json(moovies.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async find(req, res) {
    const { id } = req.params;

    try {
      const moovies = await db.query(
        `
        SELECT 
          f.*,
          c.nome AS category_nome,
          c.description AS category_description
        FROM moovies f 
        INNER JOIN category c ON c.id = f.category_id
        WHERE f.id = $1
      `,
        [id]
      );

      if (moovies.rows.length > 0) {
        res.json(moovies.rows[0]);
      } else {
        res.status(404).json({ error: "Filme não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    const { title, description, category_id, release_date } = req.body;
    const validateCategory = await db.query(
      `SELECT * FROM category WHERE id = $1`,
      [category_id]
    );
    if (validateCategory.rows.length === 0) {
      return res.status(400).json({ error: "Category nao encontrada" });
    }
    try {
      const novoFilme = await db.query(
        `INSERT INTO moovies (title, description, category_id, release_date)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, category_id, release_date]
      );

      res.status(201).json(novoFilme.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async delete(req, res) {
    const { id } = req.params;

    try {
      const validateId = await db.query(`SELECT * FROM moovies WHERE id = $1`, [
        id,
      ]);
      if (validateId.rows.length === 0) {
        return res.status(404).json({ error: "Filme não encontrado" });
      }
      const resultado = await db.query(
        "DELETE FROM moovies WHERE id = $1 RETURNING *",
        [id]
      );

      if (resultado.rowCount > 0) {
        res.status(204).json({});
      } else {
        res.status(304).json({});
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const { title, description, category_id, release_date } = req.body;

    try {
      const validateCategory = await db.query(
        `SELECT * FROM category WHERE id = $1`,
        [category_id]
      );
      if (validateCategory.rows.length === 0) {
        return res.status(404).json({ error: "Categoria nao encontrada" });
      }

      const updateMoovies = await db.query(
        `UPDATE moovies 
            SET title = $1, description = $2, category_id = $3, release_date = $4 
            WHERE id = $5
            RETURNING *;`,
        [title, description, category_id, release_date, id]
      );

      if (updateMoovies.rowCount > 0) {
        res.status(200).json(updateMoovies.rows[0]);
      } else {
        res.status(304).json({ error: "atualização nao encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = mooviesController;

var express = require('express');
var path = require('path')
var router = express.Router();
var models = require('../models')

router.get('/phonebooks', async function (req, res, next) {
    try {
        let { sortby, sort, page, limit, keyword } = req.query;

        // Menentukan nilai default jika parameter tidak diberikan
        sortby = sortby || 'name'; // Default untuk sort by name (ganti dengan kolom yang sesuai di dalam model)
        sort = sort || 'asc'; // Default untuk sort mode adalah 'asc' (ascending)
        page = parseInt(page) || 1; // Default halaman pertama
        limit = parseInt(limit) || 13; // Default batas item per halaman adalah 10

        // Menerapkan filter berdasarkan keyword jika diberikan dalam query string
        const searchParams = {};

        if (keyword) {
            searchParams[models.Sequelize.Op.or] = [
                { name: { [models.Sequelize.Op.iLike]: `%${keyword}%` } },
                { phone: { [models.Sequelize.Op.iLike]: `%${keyword}%` } },
            ];
        }

        // Menghitung nilai offset berdasarkan halaman dan batas item per halaman
        const offset = (page - 1) * limit;

        // Menambahkan parameter sort dan filter ke dalam query
        const contacts = await models.api.findAll({
            order: [[sortby, sort]], // Memastikan data diurutkan berdasarkan parameter yang diberikan
            offset: offset,
            limit: limit,
            where: searchParams, // Menggunakan filter jika diberikan
        });

        // Menghitung total contacts berdasarkan parameter yang diberikan
        const totalCount = await models.api.count({
            where: searchParams,
        });

        // Menghitung total halaman berdasarkan total data dan batas item per halaman
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            phonebooks: contacts,
            page: page,
            limit: limit,
            pages: totalPages, // Menambahkan total halaman
            total: totalCount, // Menambahkan total contact
        });
    } catch (e) {
        res.json({ error: e.message || e.toString() });
    }
});

router.post('/phonebooks', async function (req, res, next) {
    try {
        const contact = await models.api.create({
            name: req.body.name,
            phone: req.body.phone
        })
        res.status(201).json(contact)
    } catch (e) {
        res.json({ e })
    }
});

router.put('/phonebooks/:id', async function (req, res, next) {
    try {
        const id = req.params.id; // Get the ID from the request parameters
        const { name, phone } = req.body; // Get the updated name and phone from the request body

        // Check if the contact exists
        const contact = await models.api.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Update the contact with the new data
        await contact.update({
            name: name,
            phone: phone
        });

        res.status(201).json(contact);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

router.put('/phonebooks/:id/avatar', async (req, res, next) => {
    try {
        const { id } = req.params
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send(new Response('No Files Were Uploaded', false))
        }
        const sampleFile = req.files.avatar
        const fileName = `${Date.now()}-${sampleFile.name}`
        const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName)

        sampleFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).send(err)
            }
        })
        const updateAvatar = await models.api.findByPk(id)

        if (!updateAvatar) {
            return res.status(404).json('User Not Found', false)
        }
        updateAvatar.avatar = fileName;
        await updateAvatar.save();
        res.status(201).json({
            contact: updateAvatar,
            status: 'Success Updating Avatar User'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Error Updating Data User", false)
    }
});

router.delete('/phonebooks/:id', async function (req, res, next) {
    try {
        const id = req.params.id; // Get the ID from the request parameters

        // Check if the contact exists
        const contact = await models.api.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Save the contact data before deletion to respond with it after deletion
        const contactData = {
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
            avatar: contact.avatar
        };

        // Delete the contact
        await contact.destroy();

        res.status(200).json({
            message: 'Contact deleted successfully',
            contact: contactData
        });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

module.exports = router;
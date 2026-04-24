const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Parchi = require('../models/Parchi');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes using GET 'api/parchi/fetchalllist'. Login required.
router.get('/fetchalllist', fetchuser, async (req, res) => {
    try {
        const parchi = await Parchi.find({ userId: req.user.id });
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 2: Add a new parchi list using POST 'api/parchi/addlist'. Login required.
router.post('/addlist', fetchuser, [
    body('title', 'Title must be between 3 and 50 characters')
        .isLength({ min: 3, max: 50 })
        .trim(),

    body('items').optional().isArray(),

    body('items.*.name')
        .optional()
        .isString()
        .isLength({ min: 1, max: 50 })
        .trim(),

    body('items').custom((items) => {
        if (!items) return true; // 🔥 critical fix

        const names = items.map(i => i.name.toLowerCase());

        if (new Set(names).size !== names.length) {
            throw new Error('Duplicate items are not allowed');
        }

        return true;
    })
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    console.log('Body:' , req.body);
    console.log('Error:' , errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, items = [] } = req.body;
        const parchi = new Parchi({
            userId: req.user.id,
            title,
            items
        });
        const savedParchi = await parchi.save();
        res.json(savedParchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 3: Update an existing parchi title using PATCH 'api/parchi/:id'. Login required.

router.patch('/:id', fetchuser, [
    body('title', 'Title must be between 3 and 50 characters').isLength({ min: 3, max: 50 }).trim().optional(),
], async (req, res) => {
    try {
        const { title } = req.body;
        let parchi = await Parchi.findById(req.params.id);
        if (!parchi) {
            return res.status(404).send('Not Found');
        }

        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }
        if (title) {
            parchi.title = title;
        }
        await parchi.save();
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// ROUTE 4: Update an existing parchi item status using PATCH 'api/parchi/item/:itemId'. Login required.

router.patch('/item/:itemId', fetchuser, async (req, res) => {
    try {
        const { status, storeName } = req.body;

        let parchi = await Parchi.findOne({ 'items._id': req.params.itemId });

        if (!parchi) {
            return res.status(404).send('Item not found');
        }

        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }

        // Find the item inside the parchi list array
        const item = parchi.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).send('Item not found');
        }

        // Validate status if provided
        const validStatuses = ['pending', 'found', 'not found'];
        if(status !== undefined && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        if (status !== undefined) {
            item.status = status;
        }
        if (storeName !== undefined) {
            item.storeName = storeName.trim();
        }

        await parchi.save();
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 5: Add item to an existing parchi list using POST 'api/parchi/:id/items'. Login required.

router.post('/:id/items', fetchuser, async (req, res) => {
    try {
        const { name } = req.body;
        let parchi = await Parchi.findById(req.params.id);

        if (!parchi) {
            return res.status(404).send('Parchi not found');
        }
        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }

        // Add new item to the items array
        parchi.items.push({ name });
        await parchi.save();
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 6: Update an existing parchi item name using PATCH 'api/parchi/item/:itemId/name' . Login required.

router.patch('/item/:itemId/name', fetchuser, async (req, res) => {
    try {
        const { name } = req.body;

        let parchi = await Parchi.findOne({ 'items._id': req.params.itemId });

        if (!parchi) {
            return res.status(404).send('Item not found');
        }

        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }

        const item = parchi.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).send('Item not round');
        }

        item.name = name;
        await parchi.save();
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 7: Delete an existing parchi list using DElETE 'api/parchi/item/:itemId'. Login required.

router.delete('/item/:itemId', fetchuser, async (req, res) => {
    try {
        let parchi = await Parchi.findOne({ 'items._id': req.params.itemId });

        if (!parchi) {
            return res.status(404).send('Item not found');
        }
        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }
        // Remove the item from the items array
        parchi.items = parchi.items.filter(
            item => item._id.toString() !== req.params.itemId
        );
        await parchi.save();
        res.json(parchi);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// ROUTE 8: Delete an existing parchi whole using DELETE 'api/parchi/:id'. Login required.
router.delete('/:id', fetchuser, async (req, res) => {
    try {
        // Find the parchi
        let parchi = await Parchi.findById(req.params.id);
        if (!parchi) {
            return res.status(404).send('Not Found');
        }
        // Check ownership
        if (parchi.userId.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }
        // Delete the parchi
        await Parchi.findByIdAndDelete(req.params.id);
        res.json({ success: 'Parchi has been deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = router;

/*
Sample JSON for POST request to add a new parchi list:
{
  "userId": "123",
  "title": "Weekly Shopping",
  "items": [
    {
      "name": "Milk",
      "status": "found"
    },
    {
      "name": "Shampoo",
      "status": "not_found",
      "storeName": "Local Store"
    }
  ],
  "createdAt": "2026-03-21"
}

*/ 
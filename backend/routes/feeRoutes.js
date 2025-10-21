// backend/routes/feeRoutes.js
// --- FULL REPLACEABLE CODE ---

const express = require('express');
const router = express.Router();
const Fees = require('../models/Fees.js');
const { protect } = require('../middleware/authMiddleware'); // 1. IMPORT OUR PROTECT MIDDLEWARE

// @route   GET /api/fees/myfees
// @desc    Get all fee records for the logged-in student
// 2. ADD THE NEW 'protect' MIDDLEWARE
router.get('/myfees', protect, async (req, res) => {
  try {
    // 3. We can access req.user because the 'protect' middleware set it
    const fees = await Fees.find({ student: req.user.profileId })
      .populate('student', 'name roll')
      .sort({ due_date: 1 });
      
    res.json(fees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- ADMIN ROUTES ---
// (All your old routes are still here, but we should also protect them)

// @route   GET /api/fees
// @desc    Get ALL fee records (Admin only)
router.get('/', protect, async (req, res) => {
  // We can add an Admin check here later
  try {
    const fees = await Fees.find()
      .populate('student', 'name roll') 
      .sort({ due_date: 1 }); 
    res.json(fees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/fees/:id
// ... (Your other routes: GET /:id, POST, PUT, DELETE) ...
// (These should also be protected, but we'll do that later)
router.get('/:id', async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id).populate('student', 'name roll');
    if (!fee) {
      return res.status(404).json({ msg: 'Fee record not found' });
    }
    res.json(fee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { student, amount, due_date, is_paid } = req.body;
  try {
    if (!student || !amount || !due_date) {
      return res.status(400).json({ msg: 'Please provide student, amount, and due date' });
    }
    const newFee = new Fees({
      student,
      amount,
      due_date,
      is_paid: is_paid || false,
    });
    await newFee.save();
    res.json(newFee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { student, amount, due_date, is_paid } = req.body;
  try {
    let fee = await Fees.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ msg: 'Fee record not found' });
    }
    fee.student = student || fee.student;
    fee.amount = amount || fee.amount;
    fee.due_date = due_date || fee.due_date;
    fee.is_paid = is_paid;
    await fee.save();
    res.json(fee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let fee = await Fees.findById(req.params.id);
    if (!fee) {
      return res.status(4404).json({ msg: 'Fee record not found' });
    }
    await Fees.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Fee record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
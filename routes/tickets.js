const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
  getTicketsByStatus
} = require('../controllers/ticketController');
const { validateTicket } = require('../middleware/validation');
const paginate = require('../middleware/pagination');
const Ticket = require('../models/Ticket');

// Apply pagination middleware to getAllTickets
router.get('/', paginate(Ticket), getAllTickets);

// Get tickets by status
router.get('/status/:status', getTicketsByStatus);

// Get ticket by ID
router.get('/:id', getTicketById);

// Create new ticket
router.post('/', validateTicket, createTicket);

// Update ticket
router.put('/:id', validateTicket, updateTicket);

// Update ticket status only
router.patch('/:id/status', updateTicketStatus);

// Delete ticket
router.delete('/:id', deleteTicket);

module.exports = router;
const Ticket = require('../models/Ticket');
const { TICKET_STATUS, PRIORITY_LEVEL } = require('../utils/constants');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = new Ticket({
      title,
      description,
      priority: priority || PRIORITY_LEVEL.MEDIUM
    });

    const savedTicket = await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: savedTicket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message
    });
  }
};

// Get all tickets with pagination
const getAllTickets = async (req, res) => {
  try {
    const { results, totalPages, currentPage, totalCount, next, previous } = res.paginatedResults;

    res.status(200).json({
      success: true,
      count: results.length,
      totalCount,
      totalPages,
      currentPage,
      next,
      previous,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Update ticket
const updateTicket = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update fields if provided
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    const updatedTicket = await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ticket',
      error: error.message
    });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.status = status;
    const updatedTicket = await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: updatedTicket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status',
      error: error.message
    });
  }
};

// Delete ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ticket',
      error: error.message
    });
  }
};

// Get tickets by status with pagination
const getTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const tickets = await Ticket.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const totalCount = await Ticket.countDocuments({ status });
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      count: tickets.length,
      totalCount,
      totalPages,
      currentPage: page,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets by status',
      error: error.message
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
  getTicketsByStatus
};
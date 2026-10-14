import { query } from '../config/db.js';

// Regex for email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GET /employees
 * Fetch all employees with optional search, role filter, sorting, and pagination
 */
export const getAllEmployees = async (req, res) => {
  try {
    const {
      search = '',
      role = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page,
      limit,
    } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Search filter across name, email, or role
    if (search && search.trim() !== '') {
      conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR role ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Role filter
    if (role && role.trim() !== '' && role !== 'All') {
      conditions.push(`role = $${paramIndex}`);
      params.push(role.trim());
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort parameters to prevent SQL injection
    const allowedSortFields = ['id', 'name', 'email', 'role', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) AS total FROM employees ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Pagination
    let rows;
    let pagination = null;

    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      const offset = (pageNum - 1) * limitNum;

      const paginatedParams = [...params, limitNum, offset];
      const queryText = `
        SELECT id, name, email, role, created_at 
        FROM employees 
        ${whereClause} 
        ORDER BY ${safeSortBy} ${safeSortOrder} 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const result = await query(queryText, paginatedParams);
      rows = result.rows;

      pagination = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      };
    } else {
      // Non-paginated: return all matching records
      const queryText = `
        SELECT id, name, email, role, created_at 
        FROM employees 
        ${whereClause} 
        ORDER BY ${safeSortBy} ${safeSortOrder}
      `;
      const result = await query(queryText, params);
      rows = result.rows;
      pagination = {
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      };
    }

    return res.status(200).json({
      success: true,
      data: rows,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employees',
      error: error.message,
    });
  }
};

/**
 * GET /employees/:id
 * Fetch single employee by ID
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id, 10);

    if (isNaN(employeeId) || employeeId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    const result = await query(
      'SELECT id, name, email, role, created_at FROM employees WHERE id = $1',
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee',
      error: error.message,
    });
  }
};

/**
 * POST /employees
 * Add a new employee
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Validation
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters.');
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('A valid email address is required.');
    }
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      errors.push('Job role is required.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim();

    // Check if email already exists
    const existingCheck = await query('SELECT id FROM employees WHERE email = $1', [cleanEmail]);
    if (existingCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `An employee with email '${cleanEmail}' already exists.`,
      });
    }

    const result = await query(
      `INSERT INTO employees (name, email, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, role, created_at`,
      [cleanName, cleanEmail, cleanRole]
    );

    const newEmployee = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email address already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating employee',
      error: error.message,
    });
  }
};

/**
 * PUT /employees/:id
 * Update an existing employee
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id, 10);

    if (isNaN(employeeId) || employeeId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    const { name, email, role } = req.body;

    // Validation
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters.');
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('A valid email address is required.');
    }
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      errors.push('Job role is required.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim();

    // Check if employee exists
    const checkExists = await query('SELECT id FROM employees WHERE id = $1', [employeeId]);
    if (checkExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    // Check if email conflicts with another employee
    const emailConflict = await query(
      'SELECT id FROM employees WHERE email = $1 AND id != $2',
      [cleanEmail, employeeId]
    );
    if (emailConflict.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Email '${cleanEmail}' is already assigned to another employee.`,
      });
    }

    const result = await query(
      `UPDATE employees 
       SET name = $1, email = $2, role = $3 
       WHERE id = $4 
       RETURNING id, name, email, role, created_at`,
      [cleanName, cleanEmail, cleanRole, employeeId]
    );

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email address is already in use.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating employee',
      error: error.message,
    });
  }
};

/**
 * DELETE /employees/:id
 * Delete an employee
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id, 10);

    if (isNaN(employeeId) || employeeId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID provided',
      });
    }

    const result = await query(
      'DELETE FROM employees WHERE id = $1 RETURNING id, name, email, role',
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Employee '${result.rows[0].name}' deleted successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting employee',
      error: error.message,
    });
  }
};

/**
 * GET /employees/stats/summary
 * Fetch summary stats for dashboard cards
 */
export const getEmployeeStats = async (req, res) => {
  try {
    const totalCountRes = await query('SELECT COUNT(*) AS total FROM employees');
    const total = parseInt(totalCountRes.rows[0].total, 10);

    const rolesRes = await query(`
      SELECT role, COUNT(*) as count 
      FROM employees 
      GROUP BY role 
      ORDER BY count DESC
    `);

    const latestRes = await query(`
      SELECT id, name, role, created_at 
      FROM employees 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees: total,
        rolesCount: rolesRes.rows.length,
        roleBreakdown: rolesRes.rows,
        latestEmployee: latestRes.rows[0] || null,
      },
    });
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error.message,
    });
  }
};

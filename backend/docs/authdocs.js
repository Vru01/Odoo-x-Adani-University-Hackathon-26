/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and session management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@gearguard.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 enum: [user, technician, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or User already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gearguard.com"
 *               password:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token received during login
 *     responses:
 *       200:
 *         description: New Access Token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Invalid or expired Refresh Token
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (Invalidate Refresh Token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile (Protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The ID Token received from Google on the frontend
 *     responses:
 *       200:
 *         description: Login success (Returns Access & Refresh Tokens)
 *       400:
 *         description: Google Sign-In Failed
 */


/**
 * @swagger
 * tags:
 *   - name: Resources
 *     description: Master Data (Departments, Work Centers, Categories)
 *   - name: Equipment
 *     description: Asset Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         category_id:
 *           type: integer
 *         name:
 *           type: string
 *         maintenance_interval_days:
 *           type: integer
 *
 *     WorkCenter:
 *       type: object
 *       properties:
 *         work_center_id:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *
 *     Equipment:
 *       type: object
 *       properties:
 *         equipment_id:
 *           type: integer
 *         name:
 *           type: string
 *         serial_number:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, maintenance, retired, broken]
 *         category_id:
 *           type: integer
 *         work_center_id:
 *           type: integer
 */

/* ---------------- RESOURCE ROUTES (MASTER DATA) ---------------- */

/**
 * @swagger
 * /api/resources/{type}:
 *   get:
 *     summary: Get List of Resources (Dropdowns)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [companies, departments, work-centers, categories]
 *         description: The type of resource to fetch
 *     responses:
 *       200:
 *         description: List of requested resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/resources/companies:
 *   post:
 *     summary: Create a Company (Step 1)
 *     description: This is the first step in setting up the system.
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "GearGuard Industries"
 *               address:
 *                 type: string
 *                 example: "123 Industrial Estate, Tech City"
 *               contact_email:
 *                 type: string
 *                 example: "contact@gearguard.com"
 *     responses:
 *       201:
 *         description: Company Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       403:
 *         description: Access Denied (Admin Only)
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /api/resources/departments:
 *   post:
 *     summary: Create a Department (Admin Only)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               manager_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Department Created
 */

/**
 * @swagger
 * /api/resources/work-centers:
 *   post:
 *     summary: Create a Work Center (Admin Only)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               company_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Work Center Created
 */

/**
 * @swagger
 * /api/resources/categories:
 *   post:
 *     summary: Create Equipment Category (Admin Only)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               maintenance_interval_days:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category Created
 */

/* ---------------- EQUIPMENT ROUTES ---------------- */

/**
 * @swagger
 * /api/equipment:
 *   post:
 *     summary: Add New Equipment (Admin Only)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category_id
 *               - work_center_id
 *             properties:
 *               name:
 *                 type: string
 *               serial_number:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               work_center_id:
 *                 type: integer
 *               used_by_department_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Equipment Added Successfully
 */

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: List All Equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (active, maintenance)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */

/**
 * @swagger
 * /api/equipment/{id}:
 *   get:
 *     summary: Get Equipment Details & History
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipment details with recent maintenance history
 *       404:
 *         description: Equipment not found
 */

/**
 * @swagger
 * /api/equipment/{id}/status:
 *   put:
 *     summary: Update Equipment Status (Admin / Technician)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, retired, broken]
 *     responses:
 *       200:
 *         description: Status Updated
 */

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: User and Team Management
 */

/* ---------------- ADMIN ROUTES ---------------- */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all Users (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update User Role or Status (Approve Signup)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, technician, admin]
 *               account_status:
 *                 type: string
 *                 enum: [pending, active, rejected]
 *     responses:
 *       200:
 *         description: User updated
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a User
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete yourself
 */

/**
 * @swagger
 * /api/admin/teams:
 *   get:
 *     summary: List all Maintenance Teams
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams with members
 */

/**
 * @swagger
 * /api/admin/teams:
 *   post:
 *     summary: Create Maintenance Team
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               company_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Team created
 */

/**
 * @swagger
 * /api/admin/teams/{id}:
 *   put:
 *     summary: Update Team Details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated
 */

/**
 * @swagger
 * /api/admin/teams/{id}:
 *   delete:
 *     summary: Delete a Team
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team deleted
 */

/**
 * @swagger
 * /api/admin/teams/{teamId}/members:
 *   post:
 *     summary: Add Technician to Team
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [lead, member]
 *     responses:
 *       201:
 *         description: Member added
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Admin Dashboard (Approvals & Maintenance Stats)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     pending_users_count:
 *                       type: integer
 *                       description: Number of users waiting for approval
 *                     open_maintenance_requests:
 *                       type: integer
 *                     signup_requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     maintenance_requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           request_id:
 *                             type: integer
 *                           subject:
 *                             type: string
 *                           stage:
 *                             type: string
 *                           priority:
 *                             type: string
 *       403:
 *         description: Access Denied (Admin Only)
 */



/* ---------------- MAINTENANCE ROUTES ---------------- */

/**
 * @swagger
 * /api/maintenance/requests:
 *   post:
 *     summary: Create a new Maintenance Request
 *     description: Creates a ticket for equipment or work center maintenance.
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - maintenance_scope
 *               - selected_id
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Conveyor Belt Stopped"
 *               description:
 *                 type: string
 *                 example: "Belt jammed at sector 4 during morning shift"
 *               maintenance_scope:
 *                 type: string
 *                 enum: [Equipment, Work Center]
 *                 example: "Equipment"
 *               selected_id:
 *                 type: integer
 *                 description: ID of the Equipment or Work Center selected
 *                 example: 5
 *               category_id:
 *                 type: integer
 *                 description: Optional category ID
 *                 example: 2
 *               maintenance_type:
 *                 type: string
 *                 enum: [Corrective, Preventive]
 *                 default: Corrective
 *               priority:
 *                 type: string
 *                 enum: ['low', 'medium', 'high', 'critical']
 *                 description: Will be mapped to 0-3 in the backend
 *                 example: "high"
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-30T09:00:00Z"
 *               duration_hours:
 *                 type: number
 *                 format: float
 *                 example: 2.0
 *               team_id:
 *                 type: integer
 *                 example: 1
 *               technician_id:
 *                 type: integer
 *                 example: 10
 *               company_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Request created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/maintenance/requests:
 *   get:
 *     summary: Get All Maintenance Requests
 *     description: Fetches a list of requests. Admins see all; Technicians see assigned; Users see their own.
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   request_id:
 *                     type: integer
 *                   subject:
 *                     type: string
 *                   stage:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   request_date:
 *                     type: string
 *                     format: date-time
 *                   creator:
 *                     type: object
 *                     properties:
 *                       full_name:
 *                         type: string
 *                   technician:
 *                     type: object
 *                     properties:
 *                       full_name:
 *                         type: string
 */

/**
 * @swagger
 * /api/maintenance/requests/{id}:
 *   get:
 *     summary: Get Single Request Details
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The maintenance request ID
 *     responses:
 *       200:
 *         description: Request details retrieved
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /api/maintenance/requests/{id}:
 *   put:
 *     summary: Update Request (Status, Assign Tech, Schedule)
 *     description: Admins/Techs can update status/schedule. Users can only update description.
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, repaired, scrap]
 *                 description: Updates the stage of the request
 *               technician_id:
 *                 type: integer
 *               team_id:
 *                 type: integer
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *               duration_hours:
 *                 type: number
 *               priority:
 *                 type: string
 *                 enum: ['low', 'medium', 'high', 'critical']
 *     responses:
 *       200:
 *         description: Request updated
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /api/maintenance/requests/{id}:
 *   delete:
 *     summary: Delete Request (Admin Only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       403:
 *         description: Access denied (Admin Only)
 *       404:
 *         description: Request not found
 */

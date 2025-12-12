# Technical Notes - Roadworthys Application

## What Was Built

### Overview
Roadworthys is a full-stack e-commerce application for managing vehicle roadworthiness materials and services. The system integrates with ServiceM8 API for job management, materials tracking, and customer relationship management.

### Core Features

1. **Authentication System**
   - User registration and login with JWT tokens
   - HTTP-only cookie-based session management
   - Protected routes with middleware authentication
   - Password hashing with bcrypt

2. **Materials Catalog**
   - Browse active materials from ServiceM8 API
   - Filter materials by inventory status
   - Display pricing and stock information
   - Unlimited stock indication for inventoried items

3. **Shopping Cart**
   - Add/remove items with quantity management
   - Persistent cart using localStorage
   - Real-time price calculations
   - Cart badge with item count in navbar

4. **Job Management (Orders)**
   - Automatic company creation on first checkout
   - Job creation with "Quote" status
   - Link jobs to user's company via UUID
   - Job materials tracking with quantities and pricing

5. **Order Tracking**
   - List all user orders filtered by company
   - Detailed order view with materials breakdown
   - Status indicators (Quote, Work Order, Completed)
   - Total price calculations

6. **Notes System**
   - Add notes to specific jobs
   - View all notes for an order
   - Timestamp tracking for notes
   - Authorization checks for company ownership

### Technical Architecture

**Backend (Express.js + MySQL)**
- RESTful API endpoints
- Sequelize ORM for database management
- JWT authentication middleware
- ServiceM8 API integration via axios
- Database migrations for schema management

**Frontend (Next.js + TypeScript)**
- App Router with dynamic routing
- Context API for auth and cart state
- shadcn/ui component library
- Tailwind CSS for styling
- Type-safe API calls with TypeScript interfaces

**Third-Party Integration**
- ServiceM8 API for materials, jobs, companies, and notes
- OData-style filtering with `$filter` parameter
- X-Api-Key authentication header

## Reasoning Behind the Approach

### Company-User Association
**Decision:** Add `company_id` column to users table and auto-create companies on first checkout.

**Reasoning:**
- ServiceM8 requires jobs to be associated with companies
- Users may not have a ServiceM8account initially
- Creating company on-demand provides seamless onboarding
- UUID linkage ensures consistency between systems
- Single company per user simplifies authorization

### Authorization Strategy
**Decision:** Verify company ownership on all job/note operations.

**Reasoning:**
- Prevents users from accessing other customers' data
- Simple to implement and understand
- Matches the natural business model
- No complex role-based access control needed
- Fails securely by default

### Cart Persistence
**Decision:** Use localStorage for cart state persistence.

**Reasoning:**
- Cart data doesn't need server storage before checkout
- Faster user experience (no API calls for cart operations)
- Survives page refreshes
- Reduces database load
- Simple implementation with Context API

### Material Stock Display
**Decision:** Show "Always Available" for inventoried items, actual stock for non-inventoried.

**Reasoning:**
- ServiceM8 `item_is_inventoried` field indicates unlimited stock
- Users need to know if items are readily available
- Prevents confusion about stock tracking
- Matches business logic from ServiceM8

### Notes Implementation
**Decision:** Integrate with ServiceM8 notes API rather than local database.

**Reasoning:**
- Keeps all job-related data in ServiceM8 for consistency
- Notes visible in ServiceM8 interface for staff
- Single source of truth for job information
- Leverages existing ServiceM8 relationship model

### Frontend State Management
**Decision:** Use React Context API instead of Redux or other state managers.

**Reasoning:**
- Application state is relatively simple (auth + cart)
- Context API sufficient for this scale
- No need for time-travel debugging
- Reduces bundle size and complexity
- Standard React approach

## Assumptions Made

### Business Logic
1. **Single Company Per User:** Each user operates under one company account
2. **Auto-Company Creation:** Users without companies should get one automatically
3. **Job Status:** All orders start as "Quote" status
4. **Material Prices:** Prices don't change frequently; cached in cart is acceptable
5. **Inventory Model:** ServiceM8 `item_is_inventoried` field correctly indicates stock tracking

### Technical
1. **ServiceM8 API Stability:** API endpoints and response formats remain consistent
2. **UUID Format:** ServiceM8 accepts and returns UUIDs in standard format
3. **Network Reliability:** Users have stable internet for real-time API calls
4. **Browser Support:** Modern browsers with localStorage and ES6+ support
5. **Authentication:** JWT tokens in httpOnly cookies provide sufficient security

### User Behavior
1. **Email Uniqueness:** Email addresses are unique identifiers for users
2. **Cart Lifecycle:** Cart can be client-side only until checkout
3. **Session Duration:** Users complete checkout within reasonable timeframe
4. **Note Usage:** Simple text notes are sufficient (no rich text needed)
5. **Order Access:** Users only need to see their own orders, not share with others

## Potential Improvements

### Security
1. **Rate Limiting:** Add rate limiting to prevent API abuse
2. **CSRF Protection:** Implement CSRF tokens for state-changing operations
3. **API Key Rotation:** Support ServiceM8 API key rotation without downtime
4. **Input Sanitization:** Add stricter XSS protection on note inputs
5. **Audit Logging:** Track all job and note modifications for compliance

### Features
1. **Order Search/Filter:** Allow users to search and filter their orders
2. **Material Search:** Add search functionality to materials catalog
3. **Order Status Updates:** Real-time notifications when order status changes
4. **Invoice Generation:** Generate PDF invoices from job data
5. **Multiple Companies:** Support users managing multiple company accounts
6. **Note Attachments:** Allow file attachments on notes
7. **Material Images:** Display product images in catalog
8. **Favorites/Wishlists:** Save frequently ordered materials

### Performance
1. **API Caching:** Cache ServiceM8 API responses with appropriate TTLs
2. **Pagination:** Implement pagination for orders and materials lists
3. **Lazy Loading:** Load images and components on-demand
4. **Database Indexing:** Add indexes on frequently queried fields
5. **CDN Integration:** Serve static assets via CDN
6. **Query Optimization:** Reduce N+1 queries in API calls

### Developer Experience
1. **API Documentation:** Generate OpenAPI/Swagger documentation
2. **E2E Testing:** Add Cypress or Playwright tests
3. **Unit Tests:** Increase test coverage for controllers
4. **Docker Compose:** Containerize entire stack for easy setup
5. **CI/CD Pipeline:** Automate testing and deployment
6. **Error Tracking:** Integrate Sentry or similar for error monitoring
7. **Logging:** Structured logging with correlation IDs

### User Experience
1. **Mobile Optimization:** Improve responsive design for mobile
2. **Progressive Web App:** Add PWA features for offline capability
3. **Loading States:** More granular loading indicators
4. **Error Recovery:** Better error messages and recovery options
5. **Keyboard Shortcuts:** Add shortcuts for power users
6. **Accessibility:** Full WCAG 2.1 AA compliance
7. **Order Export:** Export orders to CSV/Excel

### Architecture
1. **Microservices:** Split into separate services as scale increases
2. **Message Queue:** Use queue for async operations (email, notifications)
3. **GraphQL:** Consider GraphQL for more flexible frontend queries
4. **WebSocket:** Real-time updates for order status changes
5. **Database Replication:** Read replicas for scaling read operations
6. **API Versioning:** Version API endpoints for backward compatibility

## How AI Assisted the Workflow

### Initial Setup and Architecture
- **Code Generation:** AI helped generate boilerplate code for Express server, routes, and controllers
- **Best Practices:** Suggested using Sequelize ORM and proper migration patterns
- **Security Recommendations:** Advised on JWT implementation, httpOnly cookies, and password hashing

### Problem Solving
- **CORS Issues:** Identified and fixed CORS configuration and port mismatch
- **Cookie Configuration:** Resolved sameSite cookie blocking issues for cross-origin requests
- **API Integration:** Helped understand ServiceM8 API patterns and OData filter syntax
- **State Management:** Guided implementation of React Context with localStorage persistence

### Code Quality
- **TypeScript Types:** Generated comprehensive TypeScript interfaces for API responses
- **Error Handling:** Implemented consistent error handling patterns throughout
- **Code Organization:** Structured project with separation of concerns
- **Performance:** Suggested useMemo optimization for MaterialCard component

### Feature Implementation
- **Notes System:** Designed and implemented the complete notes feature end-to-end
- **Company Auto-Creation:** Designed the company linking logic for seamless onboarding
- **Authorization:** Implemented company-based authorization checks consistently
- **UI Components:** Created consistent shadcn/ui components with proper styling

### Documentation
- **Code Comments:** Added inline documentation where complexity required explanation
- **API Patterns:** Documented the ServiceM8 API integration patterns
- **Setup Instructions:** Created comprehensive setup and testing instructions
- **Technical Context:** Organized and documented technical decisions and trade-offs

### Debugging
- **Migration Issues:** Helped troubleshoot Sequelize migration problems
- **API Response Handling:** Debugged ServiceM8 API response parsing
- **State Updates:** Fixed React state update issues in cart and notes
- **Type Errors:** Resolved TypeScript compilation errors

### Iterative Development
- **Incremental Features:** Built features step-by-step with testing at each stage
- **Refactoring:** Improved code based on user feedback (e.g., useMemo, message changes)
- **Context Preservation:** Maintained consistency across the entire codebase
- **Quick Iterations:** Rapidly implemented changes based on user requirements

### Key AI Advantages
1. **Speed:** Dramatically reduced development time for boilerplate and repetitive code
2. **Consistency:** Maintained consistent patterns across frontend and backend
3. **Documentation:** Generated comprehensive documentation alongside code
4. **Best Practices:** Applied industry-standard patterns and security practices
5. **Debugging:** Quickly identified and fixed issues based on error messages
6. **Learning:** Explained technical decisions and trade-offs throughout development

### Collaboration Pattern
The development followed an interactive pattern where:
1. User specified requirements and business logic
2. AI proposed implementation approach
3. AI generated code following established patterns
4. User tested and provided feedback
5. AI iterated based on feedback
6. Cycle repeated for each feature

This collaborative approach combined user's domain knowledge with AI's technical implementation speed, resulting in a well-structured, production-ready application.
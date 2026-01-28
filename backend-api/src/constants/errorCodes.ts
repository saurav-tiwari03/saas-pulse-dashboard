/**
 * Error codes organized by domain
 * Format: E-{domain}{number}
 * - 1xx: User
 * - 2xx: Permission
 * - 3xx: Client
 * - 4xx: Project
 * - 5xx: Master
 * - 6xx: Timeline
 * - 7xx: Vendor
 * - 8xx: Pincode/Quotation
 * - 9xx: Files
 * - 10xx: Comment
 * - 11xx: Category
 * - 12xx: Snag
 * - 13xx: MOM
 * - 14xx: Payment
 * - 15xx: Policy
 * - 16xx: Designation
 */

interface ErrorCode {
  message: string;
  httpStatus: number;
}

// ============================================
// USER ERRORS (1xx)
// ============================================
const User: Record<string, ErrorCode> = {
  "E-101": {
    message: "Invalid email or Password!",
    httpStatus: 400,
  },
  "E-102a": {
    message: "User with email already exists!",
    httpStatus: 400,
  },
  "E-102b": {
    message: "User with phone number already exists!",
    httpStatus: 400,
  },
  "E-103": {
    message: "Please login again!",
    httpStatus: 400,
  },
  "E-104": {
    message: "User not found!",
    httpStatus: 404,
  },
  "E-105": {
    message: "User is blocked!",
    httpStatus: 400,
  },
  "E-106": {
    message: "Cannot update user!",
    httpStatus: 400,
  },
  "E-107": {
    message: "Password change required!",
    httpStatus: 400,
  },
  "E-108": {
    message: "Cannot save same password!",
    httpStatus: 400,
  },
  "E-109": {
    message: "User with same email or phone number already exists!",
    httpStatus: 400,
  },
  "E-110": {
    message: "Invalid OTP!",
    httpStatus: 400,
  },
  "E-111": {
    message: "OTP expired!",
    httpStatus: 400,
  },
  "E-112": {
    message: "Failed to send OTP email!",
    httpStatus: 500,
  },
  "E-113": {
    message: "No OTP found for this user!",
    httpStatus: 400,
  },
  "E-114": {
    message: "Maximum resend attempts reached! wait for 10 mins",
    httpStatus: 400,
  },
  "E-115": {
    message: "User invite not found!",
    httpStatus: 400,
  },
  "E-116": {
    message: "User email and userId do not match!",
    httpStatus: 400,
  },
  "E-117": {
    message: "User invitation is already accepted!",
    httpStatus: 400,
  },
  "E-118": {
    message: "User invitation is already rejected!",
    httpStatus: 400,
  },
  "E-119": {
    message: "User invitation is already completed!",
    httpStatus: 400,
  },
  "E-120": {
    message: "Invalid Invitation link!",
    httpStatus: 400,
  },
  "E-121": {
    message: "Please complete your onboarding process!",
    httpStatus: 400,
  },
  "E-122": {
    message:
      "Your account is currently inactive. Please contact Support or your administrator for assistance.",
    httpStatus: 400,
  },
};

// ============================================
// PERMISSION ERRORS (2xx)
// ============================================
const Permission: Record<string, ErrorCode> = {
  "E-200": {
    message: "Role not found!",
    httpStatus: 404,
  },
  "E-201": {
    message: "Permission already exists!",
    httpStatus: 400,
  },
};

// ============================================
// CLIENT ERRORS (3xx)
// ============================================
const Client: Record<string, ErrorCode> = {
  "E-301": {
    message: "Client not found!",
    httpStatus: 404,
  },
  "E-302a": {
    message: "Client with email already exists!",
    httpStatus: 400,
  },
  "E-302b": {
    message: "Client with phone number already exists!",
    httpStatus: 400,
  },
  "E-303": {
    message:
      "Cannot create CLIENT user directly. Use /api/v1/client endpoint to create clients.",
    httpStatus: 400,
  },
  "E-304": {
    message: "GST number is required for organization clients!",
    httpStatus: 400,
  },
};

// ============================================
// PROJECT ERRORS (4xx)
// ============================================
const Project: Record<string, ErrorCode> = {
  "E-401": {
    message: "Project not found!",
    httpStatus: 404,
  },
  "E-402": {
    message: "Project with same name already exists!",
    httpStatus: 400,
  },
  "E-403": {
    message: "Cannot update project!",
    httpStatus: 400,
  },
  "E-404": {
    message: "Project type phase not found!",
    httpStatus: 404,
  },
  "E-405": {
    message: "Project type not found!",
    httpStatus: 404,
  },
  "E-406": {
    message: "Cannot update project!",
    httpStatus: 404,
  },
  "E-407": {
    message: "Phases are required!",
    httpStatus: 404,
  },
  "E-408": {
    message: "One or more phases not found or inactive!",
    httpStatus: 404,
  },
  "E-409a": {
    message: "Project type with same name already exists!",
    httpStatus: 400,
  },
};

// ============================================
// MASTER ERRORS (5xx)
// ============================================
const Master: Record<string, ErrorCode> = {
  "E-501": {
    message: "Master task not found!",
    httpStatus: 404,
  },
  "E-502": {
    message: "Master phase not found!",
    httpStatus: 404,
  },
  "E-501a": {
    message: "Master phase with same name already exists!",
    httpStatus: 400,
  },
};

// ============================================
// TIMELINE ERRORS (6xx)
// ============================================
const Timeline: Record<string, ErrorCode> = {
  "E-601": {
    message: "Timeline not found!",
    httpStatus: 404,
  },
  "E-602": {
    message: "Phase not found!",
    httpStatus: 404,
  },
  "E-603": {
    message: "Task not found!",
    httpStatus: 404,
  },
  "E-604": {
    message: "SubTask not found!",
    httpStatus: 404,
  },
  "E-605": {
    message: "Task does not belong to this phase!",
    httpStatus: 400,
  },
  "E-606": {
    message: "Phase does not belong to this timeline!",
    httpStatus: 400,
  },
  "E-607": {
    message:
      "Cannot complete task because one or more predecessor tasks are blocked!",
    httpStatus: 400,
  },
  "E-608": {
    message:
      "Cannot complete task because one or more predecessor tasks are not completed!",
    httpStatus: 400,
  },
};

// ============================================
// VENDOR ERRORS (7xx)
// ============================================
const Vendor: Record<string, ErrorCode> = {
  "E-701": {
    message: "Vendor not found!",
    httpStatus: 404,
  },
  "E-701a": {
    message: "Vendor with email already exists!",
    httpStatus: 400,
  },
  "E-701b": {
    message: "Vendor with phone number already exists!",
    httpStatus: 400,
  },
  "E-702": {
    message: "Specialized not found!",
    httpStatus: 404,
  },
  "E-703": {
    message:
      "Cannot create VENDOR user directly. Use /api/v1/vendor endpoint to create vendors.",
    httpStatus: 400,
  },
};

// ============================================
// PINCODE ERRORS (8xx)
// ============================================
const Pincode: Record<string, ErrorCode> = {
  "E-801": {
    message: "Pincode already exists!",
    httpStatus: 400,
  },
  "E-802": {
    message: "Pincode not found!",
    httpStatus: 404,
  },
  "E-803": {
    message: "Pincode is required!",
    httpStatus: 400,
  },
  "E-804": {
    message: "Address not found!",
    httpStatus: 404,
  },
};

// ============================================
// QUOTATION ERRORS (8xx - shared range)
// ============================================
const Quotation: Record<string, ErrorCode> = {
  "E-805": {
    message: "Quotation not found!",
    httpStatus: 404,
  },
};

// ============================================
// FILES ERRORS (9xx)
// ============================================
const Files: Record<string, ErrorCode> = {
  "E-900": {
    message: "Project ID is required!",
    httpStatus: 400,
  },
  "E-901": {
    message: "Folder not found!",
    httpStatus: 404,
  },
  "E-902": {
    message: "File not found!",
    httpStatus: 404,
  },
  "E-903": {
    message: "Folder with this name already exists in this location!",
    httpStatus: 400,
  },
  "E-904": {
    message: "A folder cannot be its own parent!",
    httpStatus: 400,
  },
  "E-905": {
    message:
      "Cannot delete folder with contents. Please delete or move contents first.",
    httpStatus: 400,
  },
  "E-906": {
    message: "Target folder not found!",
    httpStatus: 404,
  },
  "E-907": {
    message: "Cannot move a folder to its own subfolder!",
    httpStatus: 400,
  },
  "E-908": {
    message: "No files provided!",
    httpStatus: 400,
  },
  "E-909": {
    message: "Resource belongs to different project!",
    httpStatus: 400,
  },
  "E-910": {
    message: "Either fileId or folderId is required!",
    httpStatus: 400,
  },
  "E-911": {
    message: "Cannot move both file and folder at once!",
    httpStatus: 400,
  },
  "E-912": {
    message: "Failed to delete file from storage!",
    httpStatus: 500,
  },
};

// ============================================
// COMMENT ERRORS (10xx)
// ============================================
const Comment: Record<string, ErrorCode> = {
  "E-1001": {
    message: "Comment not found!",
    httpStatus: 404,
  },
  "E-1002": {
    message: "You are not authorized to modify this comment!",
    httpStatus: 403,
  },
  "E-1003": {
    message: "Comment is already deleted!",
    httpStatus: 400,
  },
};

// ============================================
// CATEGORY ERRORS (11xx)
// ============================================
const Category: Record<string, ErrorCode> = {
  "E-1101": {
    message: "Category not found!",
    httpStatus: 404,
  },
  "E-1102": {
    message: "Sub category not found!",
    httpStatus: 404,
  },
  "E-1103": {
    message: "One or more master items not found or inactive!",
    httpStatus: 404,
  },
  "E-1104": {
    message: "Brand not found!",
    httpStatus: 404,
  },
  "E-1105": {
    message: "Sub category already exists!",
    httpStatus: 400,
  },
};

// ============================================
// SNAG ERRORS (12xx)
// ============================================
const Snag: Record<string, ErrorCode> = {
  "E-1201": {
    message: "Snag not found!",
    httpStatus: 404,
  },
  "E-1202": {
    message: "Cannot update snag!",
    httpStatus: 400,
  },
  "E-1203": {
    message: "Assigned user not found!",
    httpStatus: 404,
  },
  "E-1204": {
    message: "You are not authorized to modify this snag!",
    httpStatus: 403,
  },
};

// ============================================
// MOM ERRORS (13xx)
// ============================================
const MOM: Record<string, ErrorCode> = {
  "E-1301": {
    message: "MOM not found!",
    httpStatus: 404,
  },
  "E-1302": {
    message: "Cannot update MOM!",
    httpStatus: 400,
  },
  "E-1303": {
    message: "One or more attendees not found!",
    httpStatus: 404,
  },
  "E-1304": {
    message: "You are not authorized to modify this MOM!",
    httpStatus: 403,
  },
};

// ============================================
// PAYMENT ERRORS (14xx)
// ============================================
const Payment: Record<string, ErrorCode> = {
  "E-1401": {
    message: "Payment not found!",
    httpStatus: 404,
  },
  "E-1402": {
    message: "Sub total amount mismatch!",
    httpStatus: 400,
  },
};

// ============================================
// POLICY ERRORS (15xx)
// ============================================
const Policy: Record<string, ErrorCode> = {
  "E-1501": {
    message: "Policy not found!",
    httpStatus: 404,
  },
};

// ============================================
// DESIGNATION ERRORS (16xx)
// ============================================
const Designation: Record<string, ErrorCode> = {
  "E-1601": {
    message: "Designation not found!",
    httpStatus: 404,
  },
  "E-1602": {
    message: "Designation with this name already exists!",
    httpStatus: 409,
  },
};

// ============================================
// GENERAL ERRORS (0xx)
// ============================================
const General: Record<string, ErrorCode> = {
  "E-001": {
    message: "Server error.",
    httpStatus: 500,
  },
  "E-002": {
    message: "Access denied!",
    httpStatus: 403,
  },
  "E-003": {
    message: "Invalid Token!",
    httpStatus: 401,
  },
  "E-004": {
    message: "Token expired!",
    httpStatus: 401,
  },
  "E-005": {
    message: "Invalid request body!",
    httpStatus: 400,
  },
  "E-006": {
    message: "Token missing!",
    httpStatus: 400,
  },
  "E-007": {
    message: "Access denied!",
    httpStatus: 403,
  },
  "E-008": {
    message: "Invalid status type",
    httpStatus: 400,
  },
  "E-400": {
    message: "Bad request!",
    httpStatus: 400,
  },
  "E-409": {
    message: "Conflict! Resource already exists.",
    httpStatus: 409,
  },
  "E-412": {
    message: "Precondition failed.",
    httpStatus: 412,
  },
  "E-413": {
    message: "Payload too large.",
    httpStatus: 413,
  },
  "E-415": {
    message: "Unsupported media type.",
    httpStatus: 415,
  },
  "E-422": {
    message: "Unprocessable entity.",
    httpStatus: 422,
  },
  "E-429": {
    message: "Too many requests.",
    httpStatus: 429,
  },
  "E-503": {
    message: "Service unavailable.",
    httpStatus: 503,
  },
};

// ============================================
// EXPORT ALL ERROR CODES
// ============================================
const ErrorCodes: Record<string, ErrorCode> = {
  ...User,
  ...Permission,
  ...Client,
  ...Project,
  ...Master,
  ...Timeline,
  ...Vendor,
  ...Pincode,
  ...Quotation,
  ...Files,
  ...Comment,
  ...Category,
  ...Snag,
  ...MOM,
  ...Payment,
  ...Policy,
  ...Designation,
  ...General,
};

export default ErrorCodes;

// Export type for use in other files
export type { ErrorCode };
export type ErrorCodeKey = keyof typeof ErrorCodes;

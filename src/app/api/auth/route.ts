import { NextResponse } from "next/server"
import { createHash } from "crypto"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Hash the provided password
    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex")
    
    // Hash the stored password
    const correctHash = createHash("sha256")
      .update(process.env.LOGIN_PASSWORD || "")
      .digest("hex")
    
    if (hashedPassword === correctHash) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    )
  }
} 
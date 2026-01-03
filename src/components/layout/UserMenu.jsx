import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function UserMenu() {
  return (
    <>
      {/* 當使用者登出時，顯示登入按鈕 */}
      <SignedOut>
        <Link to="/login" className="btn btn-ghost">
          登入
        </Link>
      </SignedOut>
      {/* 當使用者登入時，顯示 Clerk 提供的 UserButton */}
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
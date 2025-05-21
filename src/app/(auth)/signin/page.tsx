"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function SignIn() {
    const { data: session } = useSession();
    if (session) {
        return <div>Signed in as {session.user?.email}</div>;
    }
    return <div>Not signed in</div>;
}

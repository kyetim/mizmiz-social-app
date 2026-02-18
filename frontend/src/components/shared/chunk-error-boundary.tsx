'use client'

import React from "react";

type ChunkErrorBoundaryProps = {
  children: React.ReactNode;
};

type ChunkErrorBoundaryState = {
  hasTriedRecover: boolean;
};

export class ChunkErrorBoundary extends React.Component<
  ChunkErrorBoundaryProps,
  ChunkErrorBoundaryState
> {
  state: ChunkErrorBoundaryState = {
    hasTriedRecover: false,
  };

  static getDerivedStateFromError() {
    return { hasTriedRecover: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof window === "undefined") return;

    const err = error as Error & { name?: string };
    const isChunkError =
      err?.name === "ChunkLoadError" ||
      (typeof err?.message === "string" &&
        err.message.toLowerCase().includes("loading chunk"));

    if (isChunkError && !this.state.hasTriedRecover) {
      // Eski bundle'dan kalan chunk hatalarında
      // sayfayı bir kez hard refresh ile yenile
      window.location.reload();
    }
  }

  render() {
    return this.props.children;
  }
}


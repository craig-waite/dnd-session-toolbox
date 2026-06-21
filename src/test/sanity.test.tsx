import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('sanity check', () => {
  it('renders into jsdom', () => {
    render(<h1>Hello world</h1>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})

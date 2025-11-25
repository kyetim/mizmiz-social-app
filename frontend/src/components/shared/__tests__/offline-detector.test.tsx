import React from 'react'
import { render, screen } from '@testing-library/react'
import { OfflineDetector } from '@/components/shared/offline-detector'

vi.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

const setNavigatorOnlineState = (state: boolean) => {
    Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: state,
    })
}

describe('OfflineDetector', () => {
    afterEach(() => {
        setNavigatorOnlineState(true)
    })

    it('çevrimdışıyken uyarı şeridini gösterir', () => {
        setNavigatorOnlineState(false)

        render(<OfflineDetector />)

        expect(
            screen.getByText(/İnternet bağlantınız yok\. Bazı özellikler çalışmayabilir\./i)
        ).toBeVisible()
    })

    it('çevrimiçiyken herhangi bir içerik render etmez', () => {
        setNavigatorOnlineState(true)

        const { container } = render(<OfflineDetector />)

        expect(container).toBeEmptyDOMElement()
    })
})


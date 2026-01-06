import { Plugin, showMessage, confirm, Dialog, Menu, openTab, adaptHotkey, getFrontend } from 'siyuan'
import '@/index.scss'

// import { SettingUtils } from "./libs/setting-utils";
// const STORAGE_NAME = "menu-config";
// const TAB_TYPE = "custom_tab";
// const DOCK_TYPE = "dock_tab";

export default class LayoutPlugin extends Plugin {
	isMobile = false
	onload(): void {
		const frontEnd = getFrontend()
		this.isMobile = frontEnd === 'mobile' || frontEnd === 'browser-mobile'
		this.addCommand({
			langKey: 'minusGap',
			hotkey: '⌃⇧-',
			callback: () => {
				this.minusGap()
			},
		})
		this.addCommand({
			langKey: 'plusGap',
			hotkey: '⌃⇧=',
			callback: () => {
				this.plusGap()
			},
		})
		this.addCommand({
			langKey: 'minusLineHeight',
			hotkey: '⌃⇧[',
			callback: () => {
				this.minusLineHeight()
			},
		})
		this.addCommand({
			langKey: 'plusLineHeight',
			hotkey: '⌃⇧]',
			callback: () => {
				this.plusLineHeight()
			},
		})
		this.loadConfig()
	}

	onLayoutReady(): void {
		const topBarElement = this.addTopBar({
			title: this.i18n.title,
			icon: 'iconAlignRight',
			position: 'right',
			callback: () => {
				if (this.isMobile) {
					this.addMenu(null)
				} else {
					let rect = topBarElement.getBoundingClientRect()
					// 如果被隐藏，则使用更多按钮
					if (rect.width === 0) {
						rect = document.querySelector('#barMore').getBoundingClientRect()
					}
					if (rect.width === 0) {
						rect = document.querySelector('#barPlugins').getBoundingClientRect()
					}
					this.addMenu(rect)
				}
			},
		})
	}

	addMenu(rect) {
		const menu = new Menu('siyuanPluginDevtool')
		menu.addItem({
			icon: 'iconMin',
			label: this.i18n.minusGap,
			click: () => {
				this.minusGap()
			},
		})
		menu.addItem({
			icon: 'iconAdd',
			label: this.i18n.plusGap,
			click: () => {
				this.plusGap()
			},
		})
		menu.addItem({
			icon: 'iconMin',
			label: this.i18n.minusLineHeight,
			click: () => {
				this.minusLineHeight()
			},
		})
		menu.addItem({
			icon: 'iconAdd',
			label: this.i18n.plusLineHeight,
			click: () => {
				this.plusLineHeight()
			},
		})
		if (this.isMobile) {
			menu.fullscreen()
		} else {
			menu.open({
				x: rect.right,
				y: rect.bottom,
				isLeft: true,
			})
		}
	}

	minusGap() {
		const root = document.documentElement
		const currentGap = parseInt(getComputedStyle(root).getPropertyValue('--custom-gap').replace('px', ''))
		const newGap = Math.max(0, currentGap - 1) // 防止过小
		root.style.setProperty('--custom-gap', newGap.toString() + 'px')
		this.saveData('custom-gap', newGap.toString() + 'px')
	}
	plusGap() {
		const root = document.documentElement
		const currentGap = parseInt(getComputedStyle(root).getPropertyValue('--custom-gap').replace('px', ''))
		const newGap = Math.min(20, currentGap + 1) // 防止过大
		root.style.setProperty('--custom-gap', newGap.toString() + 'px')
		this.saveData('custom-gap', newGap.toString() + 'px')
	}
	minusLineHeight() {
		const root = document.documentElement
		const currentLineHeight = parseFloat(parseFloat(getComputedStyle(root).getPropertyValue('--custom-line-height')).toFixed(2)) || 1.625
		const newLineHeight = Math.max(0.1, currentLineHeight - 0.1) // 防止过小
		root.style.setProperty('--custom-line-height', newLineHeight.toString())
		this.saveData('custom-line-height', newLineHeight.toString())
	}
	plusLineHeight() {
		const root = document.documentElement
		const currentLineHeight = parseFloat(parseFloat(getComputedStyle(root).getPropertyValue('--custom-line-height')).toFixed(2)) || 1.625
		const newLineHeight = Math.min(2, currentLineHeight + 0.1) // 防止过大
		root.style.setProperty('--custom-line-height', newLineHeight.toString())
		this.saveData('custom-line-height', newLineHeight.toString())
	}

	async loadConfig() {
		const customGap = await this.loadData('custom-gap')
		if (customGap) {
			document.documentElement.style.setProperty('--custom-gap', customGap.toString() || '5px')
		}
		const customLineHeight = await this.loadData('custom-line-height')
		if (customLineHeight) {
			document.documentElement.style.setProperty('--custom-line-height', customLineHeight.toString() || '1.625')
		}
	}
}

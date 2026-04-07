'use client'
import { useEffect } from 'react'

function getLunarDate() {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-chinese', { month: 'numeric', day: 'numeric' })
    const parts = fmt.formatToParts(new Date())
    return {
      month: parseInt(parts.find(p => p.type === 'month')?.value ?? '0'),
      day: parseInt(parts.find(p => p.type === 'day')?.value ?? '0'),
    }
  } catch { return { month: 0, day: 0 } }
}

function getWeekOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return Math.ceil((date.getDate() + firstDay) / 7)
}

function checkEventActive(card: HTMLElement): 'active' | 'upcoming' | null {
  const now = new Date()
  const solarMonth = now.getMonth() + 1, solarDay = now.getDate()
  const dayOfWeek = now.getDay(), weekNum = getWeekOfMonth(now)
  const lunar = getLunarDate()
  const schedule = card.dataset.schedule

  if (schedule === 'lunar-monthly') {
    const ld = (card.dataset.lunarDays||'').split(',').map(Number)
    const sd = (card.dataset.solarDays||'').split(',').map(Number).filter(Boolean)
    if (ld.includes(lunar.day) || sd.includes(solarDay)) return 'active'
    for (const d of ld) if (d - lunar.day > 0 && d - lunar.day <= 2) return 'upcoming'
    for (const d of sd) if (d - solarDay > 0 && d - solarDay <= 2) return 'upcoming'
  }
  if (schedule === 'lunar-range') {
    const months = (card.dataset.lunarMonth||'').split(',').map(Number)
    const start = parseInt(card.dataset.lunarStart||'0'), end = parseInt(card.dataset.lunarEnd||'0')
    const isMulti = card.dataset.multiMonth === 'true'
    if (isMulti) {
      if (months.includes(lunar.month)) {
        if (lunar.month === months[0] && lunar.day >= start) return 'active'
        if (lunar.month === months[months.length-1] && lunar.day <= end) return 'active'
        if (lunar.month > months[0] && lunar.month < months[months.length-1]) return 'active'
      }
      if (lunar.month === months[0] && start - lunar.day > 0 && start - lunar.day <= 7) return 'upcoming'
    } else {
      if (months.includes(lunar.month) && lunar.day >= start && lunar.day <= end) return 'active'
      if (months.includes(lunar.month) && start - lunar.day > 0 && start - lunar.day <= 3) return 'upcoming'
    }
  }
  if (schedule === 'solar-range') {
    const sm = parseInt(card.dataset.solarMonth||'0')
    const ss = parseInt(card.dataset.solarStart||'0'), se = parseInt(card.dataset.solarEnd||'0')
    if (solarMonth === sm && solarDay >= ss && solarDay <= se) return 'active'
    if (solarMonth === sm && ss - solarDay > 0 && ss - solarDay <= 5) return 'upcoming'
  }
  if (schedule === 'weekly-wed') {
    const weeks = (card.dataset.weeks||'').split(',').map(Number)
    if (dayOfWeek === 3 && weeks.includes(weekNum)) return 'active'
    const tmr = new Date(now); tmr.setDate(tmr.getDate()+1)
    if (tmr.getDay() === 3 && weeks.includes(getWeekOfMonth(tmr))) return 'upcoming'
  }
  if (schedule === 'weekly-wed-all') {
    if (dayOfWeek === 3) return 'active'
    if (dayOfWeek === 2) return 'upcoming'
  }
  return null
}

export default function MunsusaClient() {
  useEffect(() => {
    // Nav scroll effect
    const nav = document.getElementById('nav')
    const scrollTop = document.getElementById('scrollTop')
    const onScroll = () => {
      nav?.classList.toggle('scrolled', window.scrollY > 50)
      scrollTop?.classList.toggle('show', window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll)

    // Fade-in observer
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el))

    // Event scheduler
    const grid = document.getElementById('eventsGrid')
    if (grid) {
      grid.querySelectorAll<HTMLElement>('.event-card').forEach(card => {
        const status = checkEventActive(card)
        if (status === 'active') card.classList.add('event-active')
        else if (status === 'upcoming') card.classList.add('event-upcoming')
      })
    }

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle')
    const mobileMenu = document.getElementById('mobileMenu')
    const onToggle = () => mobileMenu?.classList.toggle('open')
    const onMobileLink = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'A') mobileMenu?.classList.remove('open')
    }
    navToggle?.addEventListener('click', onToggle)
    mobileMenu?.addEventListener('click', onMobileLink)

    // Scroll to top
    const scrollTopEl = document.getElementById('scrollTop')
    const onScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    scrollTopEl?.addEventListener('click', onScrollTop)

    // Lightbox close
    const lightbox = document.getElementById('lightbox')
    const closeLb = () => lightbox?.classList.remove('open')
    lightbox?.addEventListener('click', closeLb)

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
      navToggle?.removeEventListener('click', onToggle)
      mobileMenu?.removeEventListener('click', onMobileLink)
      scrollTopEl?.removeEventListener('click', onScrollTop)
      lightbox?.removeEventListener('click', closeLb)
    }
  }, [])

  return null
}

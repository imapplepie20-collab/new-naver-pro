// ═══════════════════════════════════════
// 📅 Calendar — 캘린더 페이지
//    날짜 계산, 월 네비게이션, 이벤트 관리
// ═══════════════════════════════════════

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// ═══════════════════════════════════════
// 📋 이벤트 더미 데이터
// ═══════════════════════════════════════
const events = [
    { id: 1, title: 'Team Meeting', date: '2024-02-15', type: 'meeting', time: '10:00' },
    { id: 2, title: 'Project Deadline', date: '2024-02-20', type: 'deadline', time: '17:00' },
    { id: 3, title: 'Code Review', date: '2024-02-15', type: 'task', time: '14:00' },
    { id: 4, title: 'Sprint Planning', date: '2024-02-22', type: 'meeting', time: '09:00' },
    { id: 5, title: 'Release v2.0', date: '2024-02-28', type: 'release', time: '12:00' },
    { id: 6, title: 'Client Call', date: '2024-02-25', type: 'meeting', time: '15:00' },
    { id: 7, title: 'Design Review', date: '2024-02-18', type: 'task', time: '11:00' },
    { id: 8, title: 'Q1 Planning', date: '2024-02-12', type: 'meeting', time: '16:00' },
]

// ═══════════════════════════════════════
// 🎨 이벤트 타입별 색상 맵핑
//    Record<string, string> 유�리티 타입 - 동적 키 접근
// ═══════════════════════════════════════
const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
        meeting: 'bg-hud-accent-primary/20 text-hud-accent-primary border-l-2 border-hud-accent-primary',
        deadline: 'bg-hud-accent-danger/20 text-hud-accent-danger border-l-2 border-hud-accent-danger',
        task: 'bg-hud-accent-info/20 text-hud-accent-info border-l-2 border-hud-accent-info',
        release: 'bg-hud-accent-success/20 text-hud-accent-success border-l-2 border-hud-accent-success',
    }
    return colors[type] || ''
}

const Calendar = () => {
    // ═══════════════════════════════════════
    // 🔄 현재 날짜 상태 관리
    //    Date: JavaScript 내장 날짜 객체
    // ═══════════════════════════════════════
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1)) // 2024년 2월
    const [selectedDate, setSelectedDate] = useState<number | null>(null)

    // ⭐ 현재 월의 일 수 계산
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()

    // ═══════════════════════════════════════
    // ⭐ Array.from()으로 동적 배열 생성
        // { length: n } 객체를 배열로 변환하는 유용한 패턴
    // ═══════════════════════════════════════
    const calendarDays = [
        // 첫 주의 빈 칸들 (null로 채움)
        ...Array.from({ length: firstDayOfWeek }, () => null),
        // 실제 날짜들 (1~28/30/31)
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]

    // ═══════════════════════════════════════
    // 월 이동 함수
    // ═══════════════════════════════════════
    const prevMonth = () => setCurrentDate(new Date(year, month - 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1))

    // ═══════════════════════════════════════
    // ⭐ 특정 날짜의 이벤트 필터링
        // padStart(2, '0'): "1" → "01", "2" → "02" (두 자리수 맞춤)
    // ═══════════════════════════════════════
    const getEventsForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(event => event.date === dateStr)
    }

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ═══════════════════════════════════════
                페이지 헤더
                ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Calendar</h1>
                    <p className="text-hud-text-muted mt-1">Manage your schedule and events.</p>
                </div>
                <Button variant="primary" glow leftIcon={<Plus size={18} />}>
                    Add Event
                </Button>
            </div>

            {/* ═══════════════════════════════════════
                캘린더 카드
                ═══════════════════════════════════════ */}
            <HudCard>
                {/* ═══════════════════════════════════════
                    월 네비게이션
                    ═══════════════════════════════════════ */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-text-primary"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-hud-text-primary">
                        {monthNames[month]} {year}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-text-primary"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* ═══════════════════════════════════════
                    요일 헤더
                    ═══════════════════════════════════════ */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-hud-text-muted py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════
                    ⭐ 캘린더 그리드
                    ═══════════════════════════════════════ */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            // 빈 칸 (그냥 빈 공간)
                            return <div key={`empty-${index}`} className="h-24" />
                        }

                        const dayEvents = getEventsForDate(day)
                        const isSelected = selectedDate === day

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`h-24 p-2 rounded-lg cursor-pointer transition-hud border ${
                                    isSelected
                                        ? 'border-hud-accent-primary bg-hud-accent-primary/5'
                                        : 'border-transparent hover:bg-hud-bg-hover'
                                }`}
                            >
                                {/* 날짜 숫자 */}
                                <span className="text-sm text-hud-text-primary">{day}</span>

                                {/* ═══════════════════════════════════════
                                    이벤트 표시
                                    slice(0, 2): 최대 2개까지만 표시
                                    ═══════════════════════════════════════ */}
                                <div className="mt-1 space-y-1">
                                    {dayEvents.slice(0, 2).map(event => (
                                        <div
                                            key={event.id}
                                            className={`text-xs px-1.5 py-0.5 rounded truncate ${getEventColor(event.type)}`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {/* ═══════════════════════════════════════
                                        3개 이상일 때 "+N more" 표시
                                        ═══════════════════════════════════════ */}
                                    {dayEvents.length > 2 && (
                                        <p className="text-xs text-hud-text-muted">
                                            +{dayEvents.length - 2} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </HudCard>

            {/* ═══════════════════════════════════════
                선택된 날짜의 이벤트 상세
                ═══════════════════════════════════════ */}
            {selectedDate && (
                <HudCard
                    title={`Events for ${monthNames[month]} ${selectedDate}`}
                    subtitle="Scheduled activities"
                >
                    <div className="space-y-3">
                        {getEventsForDate(selectedDate).map(event => (
                            <div
                                key={event.id}
                                className="flex items-start gap-4 p-4 rounded-lg bg-hud-bg-primary hover:bg-hud-bg-hover transition-hud"
                            >
                                {/* 이벤트 타입별 인디케이터 */}
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                    event.type === 'meeting' ? 'bg-hud-accent-primary' :
                                    event.type === 'deadline' ? 'bg-hud-accent-danger' :
                                    event.type === 'task' ? 'bg-hud-accent-info' :
                                    'bg-hud-accent-success'
                                }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-hud-text-primary">{event.title}</p>
                                    <p className="text-xs text-hud-text-muted mt-0.5">
                                        {event.time} • {event.type}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {getEventsForDate(selectedDate).length === 0 && (
                            <p className="text-sm text-hud-text-muted text-center py-8">
                                No events scheduled for this day.
                            </p>
                        )}
                    </div>
                </HudCard>
            )}
        </div>
    )
}

export default Calendar

'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

// Sample agenda data
const agendaItems = [
  {
    id: 1,
    title: 'Upacara PNS Setempat dalam Rangka Ulang Tahun Sabu',
    date: '2022-01-15',
    time: '08:00',
    type: 'Upacara',
    location: 'Kantor Bupati'
  },
  {
    id: 2,
    title: 'Rapat Koordinasi Pembangunan',
    date: '2022-01-20',
    time: '09:00',
    type: 'Rapat',
    location: 'Ruang Rapat Utama'
  },
  {
    id: 3,
    title: 'Kunjungan Kerja ke Desa',
    date: '2022-01-25',
    time: '10:00',
    type: 'Kunjungan',
    location: 'Desa Seba'
  }
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)) // January 2022
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getAgendaForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return agendaItems.filter(item => item.date === dateString)
  }

  const hasAgenda = (date: Date) => {
    return getAgendaForDate(date).length > 0
  }

  const days = getDaysInMonth(currentDate)

  return (
    <SidebarLayout title="Agenda">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600">
            <Plus className="h-4 w-4 mr-2" />
            Buat Agenda
          </Button>
        </div>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h3 className="text-lg font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                    ${day ? 'bg-white' : 'bg-gray-50'}
                    ${selectedDate && day && day.toDateString() === selectedDate.toDateString() ? 'bg-yellow-100 border-yellow-300' : ''}
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`
                        text-sm font-medium mb-1
                        ${hasAgenda(day) ? 'text-yellow-600' : 'text-gray-900'}
                      `}>
                        {day.getDate()}
                      </div>
                      {hasAgenda(day) && (
                        <div className="space-y-1">
                          {getAgendaForDate(day).slice(0, 2).map((agenda) => (
                            <div
                              key={agenda.id}
                              className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded truncate"
                            >
                              {agenda.title}
                            </div>
                          ))}
                          {getAgendaForDate(day).length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{getAgendaForDate(day).length - 2} lainnya
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agenda List for Selected Date */}
        {selectedDate && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Agenda untuk {selectedDate.toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {getAgendaForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getAgendaForDate(selectedDate).map((agenda) => (
                    <div key={agenda.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{agenda.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {agenda.time} • {agenda.location}
                          </p>
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2">
                            {agenda.type}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Tidak ada agenda untuk tanggal ini</p>
                  <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Agenda
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agenda Mendatang</h3>
            <div className="space-y-3">
              {agendaItems.slice(0, 3).map((agenda) => (
                <div key={agenda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{agenda.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(agenda.date).toLocaleDateString('id-ID')} • {agenda.time}
                    </p>
                  </div>
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {agenda.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}

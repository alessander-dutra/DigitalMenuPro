import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchedulingSectionProps {
  deliveryType: 'delivery' | 'pickup';
  isScheduled: boolean;
  onScheduleChange: (scheduled: boolean) => void;
  scheduledDateTime: string;
  onScheduledDateTimeChange: (dateTime: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function SchedulingSection({
  deliveryType,
  isScheduled,
  onScheduleChange,
  scheduledDateTime,
  onScheduledDateTimeChange,
  notes,
  onNotesChange,
}: SchedulingSectionProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Gerar horários disponíveis (das 8h às 22h, de 30 em 30 minutos)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Gerar datas disponíveis (próximos 7 dias)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
      });
      
      dates.push({
        value: dateString,
        label: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : displayDate,
      });
    }
    
    return dates;
  };

  const handleDateTimeUpdate = (date: string, time: string) => {
    if (date && time) {
      const dateTime = `${date}T${time}:00`;
      onScheduledDateTimeChange(dateTime);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    handleDateTimeUpdate(date, selectedTime);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    handleDateTimeUpdate(selectedDate, time);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Switch
          id="schedule-order"
          checked={isScheduled}
          onCheckedChange={onScheduleChange}
        />
        <Label htmlFor="schedule-order" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Agendar {deliveryType === 'delivery' ? 'entrega' : 'retirada'}</span>
        </Label>
      </div>

      {isScheduled && (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduled-date">Data</Label>
              <Select value={selectedDate} onValueChange={handleDateChange}>
                <SelectTrigger id="scheduled-date">
                  <SelectValue placeholder="Selecione a data" />
                </SelectTrigger>
                <SelectContent>
                  {generateDateOptions().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="scheduled-time">Horário</Label>
              <Select value={selectedTime} onValueChange={handleTimeChange}>
                <SelectTrigger id="scheduled-time">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="scheduling-notes">Observações do agendamento (opcional)</Label>
            <Textarea
              id="scheduling-notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Ex: Entregar na portaria, ligar antes de chegar..."
              rows={2}
            />
          </div>

          {selectedDate && selectedTime && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Agendamento confirmado:</strong><br />
                {deliveryType === 'delivery' ? 'Entrega' : 'Retirada'} para{' '}
                {generateDateOptions().find(d => d.value === selectedDate)?.label.toLowerCase()}{' '}
                às {selectedTime}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
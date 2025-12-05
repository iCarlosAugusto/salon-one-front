import { BookingFlow } from '@/components/booking-flow'
import { Card, CardContent } from '@/components/ui/card'
import { Store } from 'lucide-react'

function ConfirmationPage() {
  return (
    <BookingFlow pathname="/confirmation">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">Forma de pagamento</span>
        <Card>
          <CardContent className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Pagamento no local</span>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">Política de cancelamento</span>
        <p className="text-sm text-muted-foreground">
          Cancele pelo menos 6 horas antes do agendamento.
        </p>
      </div>
    </BookingFlow>
  )
}

export default ConfirmationPage
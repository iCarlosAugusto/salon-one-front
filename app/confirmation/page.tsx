import { BookingFlow } from '@/components/booking-flow'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CreditCard, Icon, ShoppingCart } from 'lucide-react'


function ConfirmationPage() {
  const pathname = "/confirmation";
  return (
    <BookingFlow pathname={pathname}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Forma de pagamento</span>
          <Card>
            <CardContent className='flex items-center gap-2'>
              <ShoppingCart className="h-4 w-4" />
              <span>Pagamento no local</span>
            </CardContent>
          </Card>
        </div>

        <div>
          <span className="text-lg font-semibold">Adicionar observações</span>
          <Textarea placeholder='Digite aqui suas observações' />
        </div>
      </div>
    </BookingFlow>
  )
}

export default ConfirmationPage
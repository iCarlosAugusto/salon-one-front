import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'

const FullScreenDialog = ({ children }: { children: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>Fullscreen Dialog</Button>
            </DialogTrigger>
            <DialogContent className='mb-8 flex h-[calc(100vh-2rem)] min-w-[calc(100vw-2rem)] flex-col justify-between gap-0 p-0'>
                <DialogHeader className='contents space-y-0 text-left'>
                    <DialogTitle className='px-6 pt-6'>Product Information</DialogTitle>
                    <DialogDescription asChild>
                     {children}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='px-6 pb-6 sm:justify-end'>
                    <DialogClose asChild>
                        <Button variant='outline'>
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    </DialogClose>
                    <Button type='button'>Read More</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FullScreenDialog

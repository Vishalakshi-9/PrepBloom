import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function interviewItemCard({interview}) {

    const router = useRouter();

    const onStart = ()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }

    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-amber-700'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-500'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt}</h2>

        <div className='flex justify-between mt-2 gap-5'>
            <Button  size="sm" variant="outline" className='w-full' onClick={onFeedbackPress}>Feedback</Button>
            <Button size="sm" variant="outline" className='w-full' onClick={onStart}>Start</Button>
        </div>
    </div>
  )
}

export default interviewItemCard
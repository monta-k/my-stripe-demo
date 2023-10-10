'use client'
import { useMemo, useRef } from 'react'

interface TokenFormProps {
  handleSubmit: (formData: FormData) => Promise<void>
}

export function InvitationForm({ handleSubmit }: TokenFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <>
      <form
        action={async formData => {
          await handleSubmit(formData)
          formRef.current?.reset()
        }}
        ref={formRef}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
              name="email"
              placeholder="招待するメールアドレス"
            />
          </div>
          <button
            className="ml-2 shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
            type="submit"
          >
            招待する
          </button>
        </div>
      </form>
    </>
  )
}

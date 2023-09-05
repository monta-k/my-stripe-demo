'use client'
import { UsageToken } from '../api/_type/usageToken'
import { useMemo, useRef } from 'react'

interface TokenFormProps {
  tokens: UsageToken[]
  handleSubmit: (formData: FormData) => Promise<void>
}

export async function TokenForm({ tokens, handleSubmit }: TokenFormProps) {
  const totalToken = useMemo(() => tokens.reduce((acc, cur) => acc + cur.token, 0), [tokens])
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
              name="token"
              type="number"
              placeholder="発行トークン数"
            />
          </div>
          <button
            className="ml-2 shadow text-black bg-white focus:shadow-outline focus:outline-none py-2 px-4 rounded"
            type="submit"
          >
            発行する
          </button>
        </div>
      </form>
      <p className="text-lg">発行済みトークン数: {totalToken}</p>
    </>
  )
}

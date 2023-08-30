export default function Checkout() {
  return (
    <div className="mt-5 mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
      <form action="/api/checkout_session" method="POST">
        <button className="rounded border p-2" type="submit" role="link">
          Basicプランに加入する
        </button>
      </form>
    </div>
  )
}

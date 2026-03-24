import { MenuOrder } from "./menu-order";


export default async function MenuPage() {
  return (
    <div className='max-w-100 mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>🍕 Menu quán</h1>
        <MenuOrder />
    </div>
  )
}

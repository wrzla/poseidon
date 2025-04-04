import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Check } from "lucide-react"

interface RoomPageProps {
  params: {
    type: string
  }
}

interface RoomDetails {
  title: string
  description: string
  price: string
  imageSrc: string
  features: string[]
}

export default function RoomPage({ params }: RoomPageProps) {
  const roomTypes: Record<string, RoomDetails> = {
    economy: {
      title: "Эконом",
      description:
        "Уютный номер с основными удобствами для комфортного проживания. Идеально подходит для путешественников, которые планируют активно исследовать окрестности и используют номер преимущественно для отдыха.",
      price: "3000",
      imageSrc: "/images/room-economy.jpg",
      features: [
        "Площадь: 18 кв.м",
        "Одна двуспальная или две односпальные кровати",
        "Телевизор с плоским экраном",
        "Кондиционер",
        "Бесплатный Wi-Fi",
        "Ванная комната с душем",
        "Туалетные принадлежности",
        "Фен",
      ],
    },
    standard: {
      title: "Средний",
      description:
        "Просторный номер с дополнительными удобствами и красивым видом на лес. Отличный выбор для тех, кто ценит комфорт и уют во время отдыха.",
      price: "5000",
      imageSrc: "/images/room-standard.jpg",
      features: [
        "Площадь: 25 кв.м",
        "Одна двуспальная или две односпальные кровати",
        "Телевизор с плоским экраном и кабельными каналами",
        "Кондиционер и отопление",
        "Высокоскоростной Wi-Fi",
        "Мини-бар",
        "Рабочий стол",
        "Сейф",
        "Ванная комната с душем или ванной",
        "Премиальные туалетные принадлежности",
        "Фен и халаты",
      ],
    },
    luxury: {
      title: "Люкс",
      description:
        "Премиальный номер с максимальным комфортом и панорамным видом на лес. Идеальный выбор для тех, кто хочет получить незабываемые впечатления от пребывания в нашей гостинице.",
      price: "8000",
      imageSrc: "/images/room-luxury.jpg",
      features: [
        "Площадь: 40 кв.м",
        "Большая двуспальная кровать King-size",
        "Отдельная гостиная зона",
        "Панорамные окна с видом на лес",
        "Телевизор с плоским экраном и премиум-каналами",
        "Индивидуальный климат-контроль",
        "Высокоскоростной Wi-Fi",
        "Полностью укомплектованный мини-бар",
        "Кофемашина",
        "Рабочая зона с эргономичным креслом",
        "Электронный сейф",
        "Роскошная ванная комната с ванной и отдельным душем",
        "Премиальные туалетные принадлежности",
        "Фен, халаты и тапочки",
        "Услуга вечерней подготовки номера",
      ],
    },
  }

  const roomDetails = roomTypes[params.type]

  if (!roomDetails) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="relative h-[400px] w-full">
        <Image
          src={roomDetails.imageSrc || "/placeholder.svg"}
          alt={roomDetails.title}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
            Номер "{roomDetails.title}"
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Heading
              title="Описание номера"
              description="Все удобства для вашего комфортного отдыха"
              className="mb-6"
            />

            <p className="text-green-800 text-lg mb-8">{roomDetails.description}</p>

            <Heading
              title="Удобства и особенности"
              description="Все, что включено в стоимость номера"
              className="mb-6"
            />

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {roomDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mb-8">
              <Heading title="Правила проживания" description="Важная информация для гостей" className="mb-6" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-800">Заезд и выезд:</h3>
                  <p>Заезд с 14:00, выезд до 12:00</p>
                </div>

                <div>
                  <h3 className="font-semibold text-green-800">Правила отмены:</h3>
                  <p>Бесплатная отмена за 48 часов до заезда</p>
                </div>

                <div>
                  <h3 className="font-semibold text-green-800">Дополнительно:</h3>
                  <p>Курение запрещено. Размещение с домашними животными по предварительному согласованию.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                {roomDetails.price} ₽<span className="text-sm font-normal text-gray-600"> / ночь</span>
              </h2>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span>Базовая стоимость</span>
                  <span>{roomDetails.price} ₽</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Уборка</span>
                  <span>Включено</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Итого за ночь</span>
                  <span>{roomDetails.price} ₽</span>
                </div>
              </div>

              <Link href="/#booking">
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white">Забронировать</Button>
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">Оплата при заселении</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return [{ type: "economy" }, { type: "standard" }, { type: "luxury" }]
}


'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: QuizQuestion[] = [
  {
    question: "無人航空機の飛行原理に関する次の記述のうち、正しいものを選んでください。",
    options: [
      "無人航空機の飛行は、翼の形状によって生じる揚力のみで成り立っている。",
      "無人航空機の飛行には、揚力、重力、推力、抗力の4つの力が関与している。",
      "無人航空機は、重力を完全に無視して飛行することができる。",
      "無人航空機の飛行には推力と抗力だけが関係している。"
    ],
    correctAnswer: 1,
    explanation: "無人航空機の飛行には、揚力、重力、推力、抗力の4つの力が関与しています。この4つの力のバランスが取れていることで無人航空機は安定した飛行が可能になります。"
  },
  {
    question: "無人航空機のペイロード搭載に関する次の記述のうち、正しくないものを選んでください。",
    options: [
      "無人航空機のペイロードにはカメラやセンサーなどが含まれる。",
      "ペイロードの重量が増加すると飛行性能が低下する。",
      "ペイロードの種類や配置は飛行の安定性に影響しない。",
      "ペイロードを搭載する際には重心位置の調整が重要である。"
    ],
    correctAnswer: 2,
    explanation: "ペイロードの種類や配置は無人航空機の飛行の安定性に大きく影響します。特に、ペイロードの重量が増加すると飛行性能が低下し、重心位置がずれると機体のバランスが崩れるため、飛行の安定性が損なわれます。"
  },
  // ... 他の問題は省略 ...
]

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export default function Home() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    setQuestions(shuffleArray([...quizData]))
  }, [])

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setQuestions(shuffleArray([...quizData]))
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 bg-gradient-to-b from-sky-100 to-white relative p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-sky-700">クイズ完了</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg">おめでとうございます！全ての問題を終了しました。</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRestart} className="bg-sky-500 hover:bg-sky-600 text-white">最初からやり直す</Button>
        </CardFooter>
        <div className="absolute bottom-20 right-4 w-24 h-24">
          <Image
            src="/next/images/drone.png"
            alt="Drone flying in the sky"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </Card>
    )
  }

  if (questions.length === 0) {
    return <div className="text-center">Loading...</div>
  }

  const currentQuizData = questions[currentQuestion]

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 bg-gradient-to-b from-sky-100 to-white relative p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-sky-700">問題 {currentQuestion + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-lg font-semibold">{currentQuizData.question}</p>
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value: string) => handleAnswer(parseInt(value))}>
          {currentQuizData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2 p-2 rounded hover:bg-sky-50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{index + 1}. {option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-sky-50 rounded-lg">
            <p className={`font-bold ${selectedAnswer === currentQuizData.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
              {selectedAnswer === currentQuizData.correctAnswer ? '正解です！' : '不正解です！'}
            </p>
            {selectedAnswer !== currentQuizData.correctAnswer && (
              <p className="font-bold text-green-600 mt-2">
                正解: {currentQuizData.correctAnswer + 1}. {currentQuizData.options[currentQuizData.correctAnswer]}
              </p>
            )}
            <p className="mt-2">{currentQuizData.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={selectedAnswer === null || showExplanation} 
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          回答する
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!showExplanation} 
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          {currentQuestion < questions.length - 1 ? '次の問題' : 'クイズを終了する'}
        </Button>
      </CardFooter>
      <div className="absolute bottom-20 right-4 w-24 h-24">
        <Image
            src="/next/image/drone.png"
            alt="Drone flying in the sky"
            fill
            style={{ objectFit: 'contain' }}
        />
      </div>
    </Card>
  )
}

import { useState } from "react"
import { IoAlertCircle } from "react-icons/io5"

interface InputProps {
    className?: string
    placeholder?: string
    pattern?: string
    data?: string
    minLength?: number
    maxLength?: number
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined
    name?: 'nome' | 'email' | 'telefone' | 'nascimento' | undefined
    type: 'text' | 'number' | 'submit' | 'tel' | 'email' | 'date'
}

export const Input = ({ className = '', name, ...props }: InputProps) => {
  const tipoDeErro: (keyof ValidityState)[] = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'tooShort',
    'tooLong',
    'rangeOverflow',
    'rangeUnderflow',
    'stepMismatch',
    'badInput',
    'customError'
  ]

  const mensagensDeErro = {
    nome: {
      valueMissing: "Nome é obrigatório.",
      tooShort: "Por favor, insira seu nome completo.",
    },
    email: {
      valueMissing: "Email é obrigatório.",
      typeMismatch: "Por favor, insira um email válido.",
      tooShort: "Por favor, insira um email válido.",
    },
    telefone: {
      valueMissing: "Telefone é obrigatório.",
      patternMismatch: "Por favor, insira um telefone válido.",
    },
    nascimento: {
      valueMissing: "Data de nascimento é obrigatória.",
      patternMismatch: "Por favor, insira uma data de nascimento válida.",
    },
  }

  const [error, setError] = useState<string>("")
  const [hiddenError, setHiddenError] = useState<boolean>(true)

  function verificaInput(e: React.FocusEvent<HTMLInputElement>) {
    let mensagem = ""
    e.target.setCustomValidity('')

    const fieldName = e.target.name as InputProps['name']
    if (!fieldName) return
    let hasError = false

    tipoDeErro.forEach(tipo => {
      if (e.target.validity[tipo] && tipo in mensagensDeErro[fieldName]) {
        mensagem = mensagensDeErro[fieldName][tipo as keyof typeof mensagensDeErro[typeof fieldName]] || ""
        setError(`*${mensagem}`)
        hasError = true
      }
    })

    if (!hasError) {
      setError("")
    }
  }
  
  return (
    <div className={`${className}`}>
      <div className={`
        relative flex place-items-center rounded-lg overflow-hidden transition-colors
        ${props.type !== 'submit' ? 'bg-[#252525] border border-white/10 focus-within:border-red-600' : ''}
        ${error && 'border-red-600 border-2 border-opacity-50'}
      `}
      >
        <input
          id={name}
          name={name}
          className={`peer
                      w-full placeholder-transparent p-3 bg-transparent text-white
                      focus:outline-none focus:ring-0
                      ${props.type === 'submit' ? 'cursor-pointer' : ''}
                    `}
          onBlur={verificaInput}
          onInvalid={(e) => {
            e.preventDefault()
            setError('*Campo obrigatório.')
          }}
  
          {...props}
        />
        {name && 
          <label
            htmlFor={name}
            className={`
              absolute left-3 transition-all duration-200 cursor-text pointer-events-none
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
              peer-focus:-top-0 peer-focus:text-[10px] peer-focus:translate-y-1
              ${props.value ? '-top-0 text-[10px] translate-y-1' : 'top-3'}
              ${props.value && !error ? 'text-gray-400' : 'text-gray-500'}
              ${error ? 'text-red-500' : 'peer-focus:text-red-500'}
            `}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
        }
        {error &&
          <div className="absolute right-2">
            <IoAlertCircle 
              className="w-5 h-5 text-red-600 cursor-pointer"
              onClick={() => setHiddenError(!hiddenError)}
            />
          </div>
        }
      </div>
      {error &&
        <>
          {!hiddenError &&
            <div className="relative mt-1 bg-red-600/10 border border-red-600/20 p-2 rounded text-left">
              <p className="text-xs text-red-200">{error}</p>
            </div>
          }
        </>
      }
    </div>
  )
}
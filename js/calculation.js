// Pegando os operadores
const TIMES = document.querySelector("#times").innerHTML.trim()
const SUM = document.querySelector("#sum").innerHTML.trim()
const DIVISION = document.querySelector("#div").innerHTML.trim()
const SUBTRACTION = document.querySelector("#sub").innerHTML.trim()
const PARENTHESIS_OPEN = document.querySelector("#parenthesis_open").innerHTML.trim()
const PARENTHESIS_CLOSED = document.querySelector("#parenthesis_closed").innerHTML.trim()
const PORCENT = document.querySelector("#porcent").innerHTML.trim()
const SEPERATOR_FLOAT = document.querySelector("#float_seperator").innerHTML.trim()

const INVALID_DIVISION_BY_ZERO = "Não pode dividir por 0"

let list_operator = [TIMES, SUM, DIVISION, SUBTRACTION, PARENTHESIS_CLOSED, PARENTHESIS_OPEN, PORCENT]

// Classs Calculation
class Calculation {
    constructor() {
        this.stark_operator = []
        this.fixed_post = ''
        this.is_parenthesis_open = [] 
        this.result = 0
    }


    // Retorna o grau de prioridade dos operadores
    getDegreeOperator(op) {
        switch(op) {
            case TIMES:
            case DIVISION:
            case PORCENT:
                return 1
            case SUM:
            case SUBTRACTION:
                return 0
            default:
                return -1
        }
    }

    // Retorna um valor logico de operador de maior ordem
    isHighestPriority(op_stark, op_topo) {
        return this.getDegreeOperator(op_stark) > this.getDegreeOperator(op_topo) && op_topo != PARENTHESIS_OPEN && op_stark != PARENTHESIS_OPEN
    }

    // Metodo responsavel por desempilhar operador com maior ordem de precedencia
    addOperator(op) {
        if( this.stark_operator.length >= 1 && this.isHighestPriority(this.stark_operator[this.stark_operator.length - 1], op) ) {
            this.fixed_post += String(this.stark_operator.pop())
        }

        // Verificando se existe um parentese aberto
        if( op == PARENTHESIS_OPEN )
            this.is_parenthesis_open.push(true)

        if( op != PARENTHESIS_CLOSED )
            this.stark_operator.push(op)
    }

    // Vai colocando parantese na pilha e achar o parentese de fechamento desimpilha
    addParenthesisOpen(character) {
        let top = this.stark_operator.length

        if(this.is_parenthesis_open[this.is_parenthesis_open.length - 1] && character == PARENTHESIS_CLOSED) {
            this.is_parenthesis_open.pop()
            while( top >= 0 && this.stark_operator[top - 1] != PARENTHESIS_OPEN) {
                this.fixed_post += ` ${this.stark_operator.pop()}`
                top--
            }
            this.stark_operator.pop() // Tirar o parentese aberto caso tenha
        }
    }

    // Converter para pos-fixa
    convertToPostFixed( expression ) {
        for( let character of expression ) {
            let is_operator = list_operator.indexOf(character) != -1
            if( is_operator ) {
                if(PARENTHESIS_CLOSED != character)
                    this.addOperator(character)
                this.addParenthesisOpen(character)
            } else {
                
                if( this.character != " " ) {
                    this.fixed_post += character
                } else {
                    this.fixed_post += " "
                }

            }
        }

        // Removendo a sobra da expressao
        let length = this.stark_operator.length
        for(let i = 0; i < length; i++) {
            this.fixed_post += ` ${this.stark_operator.pop()}`
        }

    }

    // Pega uma expressao e retorna um array dessa expressao
    getExpressionArray() {
        return this.fixed_post.split(" ").filter( value => value != "")
    }

    // retorna tipo de operacao binario ou unario
    isOperatorBinary(operator) {
        switch (operator) {
            case SUM:
            case TIMES:
            case SUBTRACTION:
            case DIVISION:
                return true
            default:
                return false
        }
    }

    // Metodo que realizar a operacao binaria e retorna o valor
    performOperatorBinary(num1, num2, operator) {
        switch (operator) {
                case SUM:
                    return num1 + num2
                case SUBTRACTION:
                    return num1 - num2
                case TIMES:
                    return num1 * num2
                case DIVISION:
                    if (num2 == 0) {
                        throw INVALID_DIVISION_BY_ZERO
                    } 

                    return num1 / num2
        }
    }

    // Metodo que realiza operação unario e retorna o valor
    performOperatorUnary(num, operador) {
        switch (operador) {
            case PORCENT:
                return num / 100
        }
    }

    // Metodo que tem como objetivo realizar a operaçao
    calc() {
        let expression_array = this.getExpressionArray()
        let length = expression_array.length
        let stark_number = []

        for(let i = 0; i < length; i++) {

            // Verificando se o elemento é um numero, caso for adiciona na pilha
            if( !isNaN(expression_array[i]) ) {
                stark_number.push(expression_array[i])
            } else {
                let operator = expression_array[i]
                let num2, num1

                // Verifica se o operador é um operador binario de operacao
                if( this.isOperatorBinary(operator) ) {
                    num2 = Number(stark_number.pop())
                    num1 = Number(stark_number.pop())
                    stark_number.push(String(this.performOperatorBinary(num1, num2, operator)))
                } else {
                    num1 = Number(stark_number.pop())
                    stark_number.push(String(this.performOperatorUnary(num1, operator)))
                }
            }
            
        }

    
        this.result = stark_number.pop()
    }

    // Retorna o resultado
    getResult() {
        return this.result
    }

    clearFixedPost() {
        this.fixed_post = ""
    }

}


// Classe que tem como objetivo montar a expressao quando o usuário apertar o botao
class Calculator {
    constructor() {
        this.EQUAL = document.querySelector("#equal")
        this.CE = document.querySelector("#clear")
        this.calculation = new Calculation()
        this.DISPLAY = document.querySelector("#display")
        this.buttom_invalid = [this.CE.innerHTML, this.EQUAL.innerHTML]
        this.expression = ""
        this.fontSizeDefault = this.DISPLAY.style.fontSize

        // Carregando o simulador
        this.___load()
    }


    // Metodo para criar a expressao
    createExpression(character) {
        this.DISPLAY.style.fontSize = this.fontSizeDefault
        if(!isNaN(character) || character == SEPERATOR_FLOAT) {
            this.expression += character
        } else {
            this.expression += ` ${character} `
        }

        this.show()
    }

    // Metodo para mostrar o resultado
    show() {
        this.DISPLAY.innerHTML = this.expression == "" ? "0" : this.expression
    }

    // Responsavel por carregar todas a configuração do simulador
    ___load() {
        const div_buttoms = document.querySelectorAll(".buttom")
        const BUTTOM_VALIDO = -1
        
        for(let i = 0; i < div_buttoms.length; i++) {
            let buttom = div_buttoms[i]

            if(this.buttom_invalid.indexOf(buttom.innerHTML) === BUTTOM_VALIDO) {
                buttom.addEventListener("click", () => {
                    this.createExpression(`${buttom.innerHTML}`)
                })
            }
        }

        this.CE.addEventListener("click", () => {
            this.clear()
        })

        this.EQUAL.addEventListener("click", () => {
            this.equal()
        })
    }

    // Responsavel zerar a calculadora
    clear() {
        this.expression = ""
        this.DISPLAY.innerHTML = this.expression
        this.show()
    }

    // Responsavel por fazer a funcionalidade de quando o usuario apertar no teclado de igualdade
    equal() {

        try {
            this.calculation.convertToPostFixed(this.expression)
            this.calculation.calc()
            this.expression = this.calculation.getResult()
            this.calculation.clearFixedPost()
            this.DISPLAY.style.fontSize = this.fontSizeDefault
        } catch(e) {
            this.expression = e
            this.DISPLAY.style.fontSize = '1.4em'
        
        }
        this.show()
        this.expression = ""
    }
}

new Calculator()
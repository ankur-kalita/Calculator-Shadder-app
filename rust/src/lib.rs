use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(expression: &str) -> Result<f64, JsValue> {
    let tokens = tokenize(expression).map_err(|e| JsValue::from_str(&e))?;
    evaluate(&tokens).map_err(|e| JsValue::from_str(&e))
}

fn tokenize(expression: &str) -> Result<Vec<String>, String> {
    let mut tokens = Vec::new();
    let mut current_number = String::new();
    
    for c in expression.chars() {
        match c {
            '0'..='9' | '.' => current_number.push(c),
            '+' | '-' | '*' | '/' | '(' | ')' => {
                if !current_number.is_empty() {
                    tokens.push(current_number.clone());
                    current_number.clear();
                }
                tokens.push(c.to_string());
            }
            ' ' => {
                if !current_number.is_empty() {
                    tokens.push(current_number.clone());
                    current_number.clear();
                }
            }
            _ => return Err(format!("Invalid character: {}", c))
        }
    }
    
    if !current_number.is_empty() {
        tokens.push(current_number);
    }
    
    Ok(tokens)
}

fn evaluate(tokens: &[String]) -> Result<f64, String> {
    let mut numbers: Vec<f64> = Vec::new();
    let mut operators: Vec<char> = Vec::new();
    
    for token in tokens {
        if let Ok(num) = token.parse::<f64>() {
            numbers.push(num);
        } else {
            let op = token.chars().next().unwrap();
            while let Some(&last_op) = operators.last() {
                if precedence(last_op) >= precedence(op) {
                    apply_operator(&mut numbers, operators.pop().unwrap())?;
                } else {
                    break;
                }
            }
            operators.push(op);
        }
    }
    
    while let Some(op) = operators.pop() {
        apply_operator(&mut numbers, op)?;
    }
    
    numbers.pop().ok_or_else(|| "Incomplete expression".to_string())
}

fn precedence(op: char) -> i32 {
    match op {
        '+' | '-' => 1,
        '*' | '/' => 2,
        _ => 0,  
    }
}

fn apply_operator(numbers: &mut Vec<f64>, op: char) -> Result<(), String> {
    if numbers.len() < 2 {
        return Err("Not enough operands".into());
    }
    let b = numbers.pop().unwrap();
    let a = numbers.pop().unwrap();

    let result = match op {
        '+' => a + b,
        '-' => a - b,
        '*' => a * b,
        '/' => {
            if b == 0.0 {
                return Err("Division by zero".into());
            }
            a / b
        }
        _ => return Err("Unknown operator".into()),
    };

    numbers.push(result);
    Ok(())
}

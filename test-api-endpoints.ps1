#!/usr/bin/env pwsh
# API Endpoint Testing Script
# Tests all endpoints for Muthokinju Warehouse Management System

$baseUrl = "https://muthokinju-warehouse-management-system.onrender.com/api"
$testResults = @()
$testUser = @{
    email = "testuser@example.com"
    password = "Test@1234"
    name = "Test User"
    role = "Sales Staff"
    department = "Warehouse"
}
$token = $null

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$Description,
        [bool]$RequiresAuth = $true
    )
    
    $url = "$baseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($RequiresAuth -and $token) {
        $headers["Authorization"] = "Bearer $token"
    }
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ContentType = "application/json"
            ErrorAction = "Continue"
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        
        $result = @{
            Endpoint = $Endpoint
            Method = $Method
            Description = $Description
            Status = "✅ PASS"
            StatusCode = $response.StatusCode
            Content = $response.Content
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value
        $result = @{
            Endpoint = $Endpoint
            Method = $Method
            Description = $Description
            Status = "❌ FAIL"
            StatusCode = $statusCode
            Error = $_.Exception.Message
        }
    }
    
    $testResults += $result
    return $result
}

# Display results
function Show-Results {
    Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         API ENDPOINT TEST RESULTS                              ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
    
    foreach ($result in $testResults) {
        $statusColor = if ($result.Status -contains "✅") { "Green" } else { "Red" }
        $methodColor = switch ($result.Method) {
            "GET" { "Magenta" }
            "POST" { "Yellow" }
            "PATCH" { "Blue" }
            "DELETE" { "Red" }
            default { "White" }
        }
        
        Write-Host "[$($result.Method)]" -ForegroundColor $methodColor -NoNewline
        Write-Host " $($result.Endpoint)" -ForegroundColor White
        Write-Host "  Description: $($result.Description)" -ForegroundColor Gray
        Write-Host "  Status: " -NoNewline
        Write-Host "$($result.Status)" -ForegroundColor $statusColor
        Write-Host "  Code: $($result.StatusCode)" -ForegroundColor Yellow
        
        if ($result.Error) {
            Write-Host "  Error: $($result.Error)" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    # Summary
    $passed = @($testResults | Where-Object { $_.Status -contains "✅" }).Count
    $failed = @($testResults | Where-Object { $_.Status -contains "❌" }).Count
    $total = $testResults.Count
    
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ SUMMARY                                                        ║" -ForegroundColor Cyan
    Write-Host "╠════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ Total Tests: $total" -ForegroundColor White
    Write-Host "║ Passed: $passed" -ForegroundColor Green
    Write-Host "║ Failed: $failed" -ForegroundColor Red
    Write-Host "║ Success Rate: $(([math]::Round(($passed/$total)*100, 2)))%" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

# ========== AUTH ENDPOINTS ==========
Write-Host "🔐 Testing AUTH Endpoints..." -ForegroundColor Yellow

# 1. Health Check
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "Health Check" -RequiresAuth $false

# 2. Register User
$registerResult = Test-Endpoint -Method "POST" -Endpoint "/auth/register" `
    -Body $testUser `
    -Description "Register new user" `
    -RequiresAuth $false

# 3. Login
$loginResult = Test-Endpoint -Method "POST" -Endpoint "/auth/login" `
    -Body @{ email = $testUser.email; password = $testUser.password } `
    -Description "User login" `
    -RequiresAuth $false

# Extract token from login response if successful
if ($loginResult.Status -contains "✅") {
    try {
        $loginData = $loginResult.Content | ConvertFrom-Json
        $token = $loginData.token
        Write-Host "✅ Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not extract token from response" -ForegroundColor Yellow
    }
}

# ========== ORDER ENDPOINTS ==========
Write-Host "`n📦 Testing ORDER Endpoints..." -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/orders" -Description "Get all orders"
Test-Endpoint -Method "GET" -Endpoint "/orders/my-orders" -Description "Get user's orders"

# ========== INVENTORY ENDPOINTS ==========
Write-Host "`n📊 Testing INVENTORY Endpoints..." -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/inventory" -Description "Get all inventory items"

# ========== RECEIVING ENDPOINTS ==========
Write-Host "`n📥 Testing RECEIVING Endpoints..." -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/receiving" -Description "Get all receiving documents"

# ========== USERS ENDPOINTS ==========
Write-Host "`n👥 Testing USERS Endpoints..." -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Endpoint "/users" -Description "Get all users"

# ========== DISPLAY RESULTS ==========
Show-Results

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Green

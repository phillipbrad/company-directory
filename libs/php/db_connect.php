<?php

// Include database configuration
require_once("config.php");

// Create PDO connection (works with both MySQL and PostgreSQL)
try {
    $dsn = "{$cd_db_type}:host={$cd_host};port={$cd_port};dbname={$cd_dbname}";
    $conn = new PDO($dsn, $cd_user, $cd_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    // Connection failed
    $conn = null;
}

// Create a mysqli-compatible wrapper class for backward compatibility
class MySQLiWrapper {
    private $pdo;
    public $connect_errno = 0;
    public $error = '';
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
        if ($pdo === null) {
            $this->connect_errno = 1;
            $this->error = "Connection failed";
        }
    }
    
    public function query($sql) {
        try {
            $stmt = $this->pdo->query($sql);
            return new ResultWrapper($stmt);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }
    
    public function prepare($sql) {
        try {
            return new StatementWrapper($this->pdo->prepare($sql));
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }
    
    public function real_escape_string($string) {
        return substr($this->pdo->quote($string), 1, -1);
    }
    
    public function close() {
        $this->pdo = null;
        return true;
    }
    
    public function insert_id() {
        return $this->pdo->lastInsertId();
    }
    
    public function affected_rows() {
        return $this->pdo->rowCount();
    }
}

class ResultWrapper {
    private $stmt;
    public $num_rows = 0;
    
    public function __construct($stmt) {
        $this->stmt = $stmt;
        if ($stmt) {
            $this->num_rows = $stmt->rowCount();
        }
    }
    
    public function fetch_all($mode = MYSQLI_ASSOC) {
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function fetch_assoc() {
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }
}

class StatementWrapper {
    private $stmt;
    public $error = '';
    
    public function __construct($stmt) {
        $this->stmt = $stmt;
    }
    
    public function bind_param($types, &...$vars) {
        foreach ($vars as $i => $var) {
            $this->stmt->bindParam($i + 1, $var);
        }
        return true;
    }
    
    public function execute() {
        try {
            return $this->stmt->execute();
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }
    
    public function get_result() {
        return new ResultWrapper($this->stmt);
    }
    
    public function close() {
        $this->stmt = null;
        return true;
    }
}

// Create mysqli-compatible connection
$conn = new MySQLiWrapper($conn);

// Helper function for mysqli_connect_errno()
function mysqli_connect_errno() {
    global $conn;
    return $conn->connect_errno;
}

// Helper function for mysqli_close()
function mysqli_close($connection) {
    return $connection->close();
}

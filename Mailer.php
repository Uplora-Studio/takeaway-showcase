<?php

namespace mozzarella;

class Mailer
{
    private $from;
    private $to;
    private $body;
    private $header;
    private $subject;

    public function __construct($from, $to, $subject, $content)
    {
        $this->from = $from;
        $this->to = $to;
        $this->subject = $subject;
        $this->setUpBody($content);
        $this->setUpHeader($this->from);
    }

    private function setUpBody($content)
    {
        $this->body = "<div style=\"background-color:#ace2fa; width:550px; padding:15px; margin:auto; border:1px solid #008\">";
        $this->body .= $content;
        $this->body .= "</div>";
    }

    private function setUpHeader($from)
    {
        $separator = "\r\n";
        $this->header = "From: ";
        $this->header .= $from . $separator;
        $this->header .= "Content-type: text/html; charset=utf-8" . $separator;
        // $this->header .= "MIME-Version 1.0";
    }

    public function sendMail()
    {
        mail($this->to, $this->subject, $this->body, $this->header);
    }
}

?>